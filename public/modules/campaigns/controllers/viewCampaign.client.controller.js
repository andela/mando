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

    $scope.deleteCampaign = function() {
    backendService.deleteCampaign($scope.campaign).success(function() {
      alert('Do you want to delete this campaign');
      $scope.deletemsg = 'DELETED';
       // $location.path('/campaigns/:userId');
        console.log('deleted');
    }).error(function(error) {
      console.log('error');
    });

  };
  }
]);