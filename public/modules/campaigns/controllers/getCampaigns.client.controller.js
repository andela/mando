'use strict';

angular.module('campaign').controller('getCampaignsCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.myCampaigns ={};
  $scope.authentication = Authentication;
    if (!$scope.authentication.user) {
      $location.path('/');
    }

    backendService.getUserCampaigns($scope.authentication.user).success(function(myCampaigns) {
      $scope.myCampaigns = myCampaigns;
      console.log(1, myCampaigns);
      console.log(2, $scope.myCampaigns);
    });

  }]);