'use strict';

angular.module('admin').controller('adminUserCtrl', ['$scope', 'Authentication', 'adminBackendService', '$location', 'lodash', '$state', '$modal', function($scope, Authentication, adminBackendService, $location, lodash, $state, $modal) {

  $scope.authentication = Authentication;
  //redirects if user is not logged in
  if (!$scope.authentication.user) {
    $location.path('/');
  }
  //redirects user to myAndonation is user is logged in and not an admin
  if (!lodash.findWhere(Authentication.user.roles, {'roleType': 'admin'})) {
    $state.go('userCampaigns');
  }

  adminBackendService.getUsers()
    .success(function(data, status, header, config) {
      $scope.users = data;

      for(var i=0;i<$scope.users.length;i++){
        $scope.users[i].checked = false;
      }
    })
    .error(function(error, status, header, config) {
      //do proper error handling
      $scope.error = error;
    });
    var NoOfCheckedUser = 0;
    //activates the modal window
    $scope.openModal = function () {
      var roles = []; var count = 0;
      angular.forEach($scope.users, function (user, key) {
        if (user.checked) {
          NoOfCheckedUser++;
          for (var i = 0; i < user.roles.length; i++) {
              if (NoOfCheckedUser > 1) {
                if(lodash.findWhere(roles, {'roleType': user.roles[i].roleType})) {
                  var temp = lodash.findWhere(roles, {'roleType': user.roles[i].roleType});
                  temp.count++;
                } else {
                   if (user.roles[i].roleType === 'admin' && user._id === $scope.authentication.user._id) {
                      user.roles[i].isAdmin = true;
                    }
                    roles.push(user.roles[i]);
                }
              } else {
                if (user.roles[i].roleType === 'admin' && user._id === $scope.authentication.user._id) {
                  user.roles[i].isAdmin = true;
                }
                user.roles[i].count = 1;
                roles.push(user.roles[i]);
              }
          }
        }
      });

      var modalInstance = $modal.open({
        templateUrl: 'modules/admin/views/updateRoles.admin.modal.client.view.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm',
        resolve: {
          roles: function () {
            return roles;
          },
          len: function() {
            return NoOfCheckedUser;
          }
        }
      });

      modalInstance.result.then(function (roles) {
        var usersid = [], _roles = [];
        angular.forEach($scope.users, function(user) {
          if(user.checked) {
            usersid.push(user._id);
          }
        });
        for (var y = 0; y < roles.length; y++) {
          if(roles[y].checked) {
            _roles.push(roles[y].roleType);
          }
        }
        var data = {};
        data.roles = _roles;
        data.usersid = usersid;
        adminBackendService.updateUserRoles(data).success(function(data, status, header, config) {
        })
        .error(function(error, status, header, config) {
          });
      });
    };

}]);
