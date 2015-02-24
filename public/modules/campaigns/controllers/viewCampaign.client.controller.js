'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope','toaster' , 'backendService','$location', 'Authentication', '$stateParams',
function($scope, toaster, backendService,$location, Authentication, $stateParams) {
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

//delete this code
    $scope.deleteCampaign = function(data, toastr) {
       var confirmMsg = confirm('Do you want to delete this Campaign?');
      if(confirmMsg === true) {
          backendService.deleteCampaign($scope.campaign).success(function(text) {
          toaster.pop('success', $scope.campaign.title, 'Campaign deleted successfully');
          $location.path('/campaigns/:userId');
          console.log('deleted');
          }).error(function(error) {
          console.log('error');
        });
      } else {
        $location.path('/campaign/'+ data._id);
      }

  };
  }
]);