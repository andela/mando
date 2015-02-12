'use strict';

angular.module('campaign').controller('addCampaignCtrl', ['$scope', 'backendService', 'Authentication', '$location',
  function($scope, Authentication, backendService, $location) {
    //provides the authentication object
    $scope.authentication = Authentication;
    $scope.campaign = {};
    //if unauthenticated, go to home
    if (!$scope.authentication.user) {
      $location.path('/');
    }
    $scope.addCampaign = function() {
      backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
          console.log(data);
        })
        .error(function(error, status, header, config) {
          console.log(error);
        });
    };
  }
]);