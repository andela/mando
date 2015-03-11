'use strict';

// angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', 'toaster','$location', 'bankerFactory','Authentication', '$stateParams', 'lodash',
// function($scope, backendService, toaster, $location, bankerFactory, Authentication, $stateParams, lodash) {

///bankerFactory  add this to the dependency to get the system balance
// <<<<<<< HEAD

// =======
angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService','toaster','$location','bankerFactory','bankerConstant' ,'Authentication', '$stateParams','lodash',
function($scope, backendService, toaster, $location, bankerFactory ,bankerConstant, Authentication, $stateParams,lodash) {
// >>>>>>> added constants for the system id and bank id
  $scope.myCampaigns    = [];
  $scope.balance = {};
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
    //if role = banker use the banker id here else you the user's id$scope.authentication.user.account_id
    var account_id = bankerConstant.BANK_ID;
      bankerFactory.getSystemBalance(account_id).balance({description: 'USD'}, function(error, apiRes){
        if (error){
           toaster.pop('error', 'An Error Occurred'+ error);
            return;
        }else{
          var amount = parseInt(apiRes.balance.value.amount);
          $scope.balance.amount = amount;
          $scope.$digest();
        }
      });
 // };
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