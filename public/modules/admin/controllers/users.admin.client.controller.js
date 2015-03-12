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
      var roles = [];
      angular.forEach($scope.users, function (user, key){
        if(user.checked){
          NoOfCheckedUser++;
          for(var i=0; i<user.roles.length; i++){
              var id = false;
              for(var r=0; r<roles.length; r++){
                if(user.roles[i].roleType === roles[r].roleType){
                  id = r;
                }
              }
              if(id === false){
                if(user._id === $scope.authentication.user._id) {
                  user.roles[i].isAdmin = true;
                }
                user.roles[i].count = 1;
                roles.push(user.roles[i]);
              }else{
                roles[id].count++;
              }
          }
        }
      });

            console.log(roles);
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
        var userid = [], _roles = [];
        for(var i=0; i < $scope.users.length; i++) {
          for(var j=0; j<roles.length; j++) {
            if(roles[j].checked === $scope.users[i].checked && $scope.users[i].checked === true) {
              if(userid.indexOf($scope.users[i]._id) === -1) {
                userid.push($scope.users[i]._id);
              }
              if(_roles.indexOf(roles[j].roleType) === -1) {
                _roles.push(roles[j].roleType);
              }
            }
          }
        }
        console.log(1,userid);
        console.log(2, _roles);
        console.log(roles);
        console.log($scope.users);
      });
    };

}]);
