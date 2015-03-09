'use strict';

angular.module('admin').controller('adminUserCtrl', ['$scope', 'adminBackendService', 'Authentication', function($scope, adminBackendService, Authentication) {

  adminBackendService.getUsers()
    .success(function(data, status, header, config) {
      $scope.users = data;
    })
    .error(function(error, status, header, config) {
      $scope.error = error;
    });

  //adds a comma delimiter after each row except the last
  //this can be refactored to use a directive
  $scope.hide = function(isLast) {
    return isLast ? true : false;
  };
}]);
