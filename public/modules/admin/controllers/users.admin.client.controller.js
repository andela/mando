'use strict';

angular.module('admin').controller('adminUserCtrl', ['$scope', 'adminBackendService', 'Authentication', function($scope, adminBackendService, Authentication) {
  // var role = {};
  // role.role = 'member';
  // role.user = {};
  // role.user._id = '54f2f47b599d4e96a54e5a3d';
  // adminBackendService.addRolesToUser(role)
  //   .success(function(data, status, header, config) {
  //     console.log(data);
  //     $scope.role = data;
  //   })
  //   .error(function(error, status, header, config) {
  //     console.log(error);
  //   });
  adminBackendService.getUsers()
    .success(function(data, status, header, config) {
      $scope.users = data;
    })
    .error(function(error, status, header, config) {
      $scope.error = error;
    });
}]);
