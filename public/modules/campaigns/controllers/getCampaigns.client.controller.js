'use strict';

angular.module('campaign').controller('getCampaignsCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.myCampaigns    = [];
  $scope.authentication = Authentication;

  if (!$scope.authentication.user) {
    $location.path('/');
  }

  // using the backend service to get campaign data from the back end
  backendService.getUserCampaigns($scope.authentication.user).success(function(myCampaigns) {
    $scope.myCampaigns = myCampaigns;
  });

  // function to click the show more button on getMoreCampaigns page
  $scope.limit = 4;
  $scope.increment = function() {
    var campaignLength = $scope.myCampaigns.length;
    $scope.limit = campaignLength;
  };

  $scope.decrement = function() {
    $scope.limit = 4;
  };

}]);