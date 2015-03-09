'use strict';

angular.module('admin').controller('adminUserCtrl', ['$scope', 'Authentication', 'adminBackendService', '$location',  'lodash', '$state', function($scope, Authentication, adminBackendService, $location, lodash, $state) {

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
