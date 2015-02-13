'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope', 'backendService','$stateParams', '$location', 'Authentication',
function($scope, backendService, $stateParams, $location,  Authentication) {
  $scope.authentication = Authentication;
    $scope.campaign = {};

    if (!$scope.authentication.user) {
      $location.path('/');
    }
    $scope.viewCampaign = function() {
      backendService.viewCampaign($stateParams)
      .success(function(data, status, header, config) {
          console.log(data);
      $scope.campaign = data;
        })
        .error(function(error, status, header, config) {
          console.log(error);
        });
    };
    $scope.viewCampaign();
  }
]);