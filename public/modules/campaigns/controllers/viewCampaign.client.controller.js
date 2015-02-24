'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.authentication = Authentication;
    if (!$scope.authentication.user || !$stateParams.campaignid) {
      $location.path('/');
    }
    $scope.campaign = {
      _id: $stateParams.campaignid
    };

    backendService.getCampaign($scope.campaign)
    .success(function(data, status, header, config) {
      $scope.campaign = data;
    })
    .error(function(error, status, header, config) {
      console.log(error);
    });
  }
]);