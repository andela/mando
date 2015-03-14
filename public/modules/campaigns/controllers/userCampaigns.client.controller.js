'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService','toaster','$location','bankerFactory' ,'Authentication', '$stateParams','lodash','credentials',
function($scope, backendService, toaster, $location, bankerFactory, Authentication, $stateParams,lodash, credentials) {

  $scope.myCampaigns = [];
  $scope.balance = {};
  $scope.authentication = Authentication;

  if (!$scope.authentication.user) {
    $location.path('/');
  }

  //checks if user is an admin
  $scope.isAdmin = lodash.findWhere(Authentication.user.roles, {'roleType': 'admin'}) ? true : false;
  $scope.isBanker = lodash.findWhere(Authentication.user.roles, {'roleType': 'banker'}) ? true : false;
  console.log(credentials);
  var cred = credentials.data;
   bankerFactory.setCredentials(cred.key_id, cred.secret_id);

  $scope.isDistributor = Authentication.hasRole('distributor');

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
      bankerFactory.getSystemBalance(cred.org_id, cred.book_id, cred.bank_id).balance({description: 'USD'}, function(error, apiRes){
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