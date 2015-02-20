'use strict';

angular.module('campaign').controller('getCampaignsCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.authentication = Authentication;
    if (!$scope.authentication.user) {
      $location.path('/');
    }

    backendService.getUserCampaigns($scope.authentication.user).success(function(result) {
      console.log(1, result);
    });

  }]);