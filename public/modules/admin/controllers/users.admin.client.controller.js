'use strict';

angular.module('admin').controller('adminUserCtrl', ['$scope', 'adminBackendService', function($scope, adminBackendService) {
  adminBackendService.getUsers()
    .success(function(data, status, header, config) {
      $scope.users = data;
    })
    .error(function(error, status, header, config) {
      $scope.error = error;
    });
}]);
