'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', 'toaster', '$location', 'bankerFactory', 'Authentication', '$stateParams', 'lodash', 'credentials', '$state',
  function($scope, backendService, toaster, $location, bankerFactory, Authentication, $stateParams, lodash, credentials, $state) {

    $scope.myCampaigns = [];
    $scope.balance = {};
    $scope.authentication = Authentication;

    Authentication.requireLogin($state);
    //checks if user is an admin
    $scope.isAdmin = Authentication.hasRole('admin');
    $scope.isBanker = Authentication.hasRole('banker');
    var cred = credentials.data;
    bankerFactory.setCredentials(cred);

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

    //if role = banker use the banker id here else you the user's id$scope.authentication.user.cred.bank_id
    $scope.getBalance = function() {
      bankerFactory.getSystemBalance(cred.org_id, cred.book_id, cred.bank_id).balance({
        description: 'USD'
      }, function(error, apiRes) {
        if (error) {
          toaster.pop('error', 'An Error Occurred' + error);
          return;
        } else {
          var amount = parseInt(apiRes.balance.value.amount);
          $scope.balance.amount = amount;
          $scope.$digest();
        }
      });
    };
    $scope.getBalance();
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

    //Getting all transactions in the system for a particular banker.
    $scope.getJournals = function(cb) {
      bankerFactory.getJournalReports(cred.org_id, cred.book_id, cred.bank_id).get({
        'description': 'USD',
        'action': 'before',
        'effective_at': new Date().toISOString()
      }, function(error, apiRes) {
        if (error) {
          return error;
        } else {
          for (var i = 0; i < apiRes.posted_lines.length; i++) {
            try {
              var stringToObj = JSON.parse(apiRes.posted_lines[i].description);
              apiRes.posted_lines[i].description = stringToObj;
            } catch (e) {
              apiRes.posted_lines[i].description = {
                'name': 'anonymous',
                'description': apiRes.posted_lines[i].description
              };
            }
          }
          $scope.journal = apiRes.posted_lines;
          $scope.query = $scope.authentication.user.email;
          $scope.$digest();
          if (!!cb) {
            cb();
          }
        }
      });
    };
    $scope.getJournals();
  }
]);
