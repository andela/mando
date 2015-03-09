'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams', 'lodash',
function($scope, backendService, $location, Authentication, $stateParams, lodash) {
  $scope.myCampaigns    = [];
  $scope.authentication = Authentication;

  if (!$scope.authentication.user) {
    $location.path('/');
  }
  //checks if user is an admin
  $scope.isAdmin = lodash.findWhere(Authentication.user.roles, {'roleType': 'admin'}) ? true : false;

  //uses the Currently signed-in id to get the user id.
  var userid = $scope.authentication.user._id;

  backendService.getUserCampaigns(userid)
    .success(function(myCampaigns) {
      $scope.myCampaigns = myCampaigns;
    })
    .error(function(error, status, header, config) {
      //not cool to redirect the user if any error occured, should be improved by
      //checking for the exact error act base on the error
      $location.path('/');

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