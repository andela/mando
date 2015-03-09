'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', '$location', 'bankerFactory','Authentication', '$stateParams', 'lodash',
function($scope, backendService, $location, bankerFactory, Authentication, $stateParams, lodash) {

///bankerFactory  add this to the dependency to get the system balance

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
    var account_id = 'mnE22eIutb5SwDH69Ernfx';
    console.log('account is '+ $scope.authentication.user.account_id);
//    $scope.systemBalance = function(account_id){ 
  //    console.log('inside'+account_id);
      bankerFactory.getSystemBalance(account_id).balance({description: 'USD'}, function(error, apiRes){
        if (error){
          console.log(error);
        }else{
          console.log(3, apiRes);
          var amount = parseInt(apiRes.balance.value.amount);
          console.log('here', amount);
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