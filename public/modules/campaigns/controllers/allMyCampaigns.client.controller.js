'use strict';
angular.module('campaign').controller('allMyCampaignCtrl', ['$scope', 'backendService', 'Authentication', '$state',  function($scope, backendService, Authentication, $state) {
  $scope.myCampaigns = [];
  $scope.authentication = Authentication;
  Authentication.requireLogin($state);
  var userid = $scope.authentication.user._id;
  backendService.getUserCampaigns(userid)
    .success(function(data) {
      $scope.myCampaigns = data;
      // for (var i = 0; i < $scope.myCampaigns.length; i++) {
      //   var accountNo = data[i].account_id;
      //   $scope.getCampaignBalance(accountNo, $scope.myCampaigns[i]);
      // }
    })
    .error(function(error, status, header, config) {
      //not cool to redirect the user if any error occured, should be improved by
      //checking for the exact error act base on the error
      $location.path('/');
    });
}]);


