'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.myCampaigns    = [];
  $scope.authentication = Authentication;
  if (!$scope.authentication.user || !$stateParams.userid) {
    $location.path('/');
  }
  // using the backend service to get campaign data from the back end
  var userid = $scope.authentication.user._id;
  backendService.getUserCampaigns(userid).success(function(myCampaigns) {
    if (myCampaigns.length < 1) {
       myCampaigns = false;
    } else {
    $scope.myCampaigns = myCampaigns;
     myCampaigns = false;
  }
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