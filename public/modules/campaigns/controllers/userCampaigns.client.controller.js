'use strict';

// <<<<<<< HEAD
// angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', 'toaster', '$location', 'subledgerServices', 'Authentication', '$stateParams', 'lodash', 'credentials', '$state',
//     function($scope, backendService, toaster, $location, subledgerServices, Authentication, $stateParams, lodash, credentials, $state) {

//         $scope.myCampaigns = [];
//         $scope.systemBalance = {};
//         $scope.balance = {};
//         $scope.journal = [];
//         $scope.myJournal = [];
//         $scope.authentication = Authentication;
//         Authentication.requireLogin($state);
//         //checks if user is an admin
//         $scope.isAdmin = Authentication.hasRole('admin');
//         $scope.isBanker = Authentication.hasRole('banker');
//         $scope.query = $scope.authentication.user.displayName;
//         var cred = credentials.data;
//         subledgerServices.setCredentials(cred);

//         $scope.isDistributor = Authentication.hasRole('distributor');

//         //uses the Currently signed-in id to get the user id.
//         var userid = $scope.authentication.user._id;

//         backendService.getUserCampaigns(userid)
//             .success(function(myCampaigns) {
//                 $scope.myCampaigns = myCampaigns;
//             })
//             .error(function(error, status, header, config) {
//                 //not cool to redirect the user if any error occured, should be improved by
//                 //checking for the exact error act base on the error
//                 $location.path('/');
//             });

//         $scope.getCurrentBalance = function(account, destination) {
//             subledgerServices.getBalance(account, function(response) {
//                 destination.amount = response;
//                 $scope.$digest();
//             });
//         };
//         $scope.getCurrentBalance(cred.bank_id, $scope.systemBalance);
//         $scope.getCurrentBalance($scope.authentication.user.account_id, $scope.balance);

//         //GET UNIQUE USER JOURNAL REPORTS  
//         //this methods should only load the bank and  another method will load the user and filter it by 
//         //query seems to be undefined here 
//         $scope.getJournals = function(account, cb) {
//             subledgerServices.getJournals(account, function(response) {
//                 response = response.posted_lines;
//                 cb(response);
//             //    url();

//             });
//         };
//         $scope.getJournals(cred.bank_id, function(response) {
//             $scope.journal = response;
//             $scope.$digest();
//         });
//         $scope.getJournals($scope.authentication.user.account_id, function(response) {
//             $scope.myJournal = response;
//             $scope.$digest();
//         });
//         // function to click the show more button on getMoreCampaigns page
//         $scope.limit = 4;
//         $scope.increment = function() {
//             var campaignLength = $scope.myCampaigns.length;
//             $scope.limit = campaignLength;
//         };

//         $scope.decrement = function() {
//             $scope.limit = 4;
//         };
//     }
// =======
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
          $scope.query = Authentication.user.email;
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
