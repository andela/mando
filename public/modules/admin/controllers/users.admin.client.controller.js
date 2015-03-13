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
    //activates the modal window
    $scope.openModal = function () {
      var roles = []; var count = 0, NoOfCheckedUsers = 0;
      angular.forEach($scope.users, function (user, key) {
        if (user.checked) {
          NoOfCheckedUsers++;
          for (var i = 0; i < user.roles.length; i++) {
              if (NoOfCheckedUsers > 1) {
                if(lodash.findWhere(roles, {'roleType': user.roles[i].roleType})) {
                  var temp = lodash.findWhere(roles, {'roleType': user.roles[i].roleType});
                  temp.count++;
                } else {
                   if (user.roles[i].roleType === 'admin' && user._id === $scope.authentication.user._id) {
                      user.roles[i].isAdmin = true;
                    }
                    user.roles[i].count = 1;
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
            return NoOfCheckedUsers;
          }
        }
      });

      modalInstance.result.then(function (roles) {
        var data = {};
        data.roles = [];
        var addRoles = {addRoles: []};
        var rmRoles = {rmRoles: []};
        data.usersid = [];
        angular.forEach($scope.users, function(user) {
          if(user.checked) {
            data.usersid.push(user._id);
          }
        });
        for (var y = 0; y < roles.length; y++) {
          if(roles[y].checked === true) {
            addRoles.addRoles.push(roles[y].roleType);
          } else if (roles[y].checked === false) {
            rmRoles.rmRoles.push(roles[y].roleType);
          }
        }
        data.roles.push(addRoles);
        data.roles.push(rmRoles);
        console.log(data.roles);
        adminBackendService.updateUserRoles(data).success(function(data, status, header, config) {
          console.log(data);
        })
        .error(function(error, status, header, config) {
          console.log(error);
          });
      });
    };

}]);
