'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', 'toaster', '$location', 'subledgerServices', 'Authentication', '$stateParams', 'lodash', 'credentials', '$state', 'ngTableParams', '$filter',
  function($scope, backendService, toaster, $location, subledgerServices, Authentication, $stateParams, lodash, credentials, $state, ngTableParams, $filter) {

    $scope.myCampaigns = [];
    $scope.systemBalance = {};
    $scope.balance = {};
    $scope.journal = [];
    $scope.myJournal = [];
    $scope.authentication = Authentication;
    Authentication.requireLogin($state);
    //checks if user is an admin
    $scope.isAdmin = Authentication.hasRole('admin');
    $scope.isBanker = Authentication.hasRole('banker');
    $scope.query = $scope.authentication.user.displayName;
    var cred = credentials.data;
    subledgerServices.setCredentials(cred);

    $scope.isDistributor = Authentication.hasRole('distributor');

    //uses the Currently signed-in id to get the user id.
    var userid = $scope.authentication.user._id;

    backendService.campaignsIBacked().success(function(data) {
      $scope.campaignsBacked = data;
      $scope.noOfCampaignsBacked = data.length;
      for (var i = 0; i < data.length; i++) {
        $scope.getCampaignBalance(data[i].campaignid.account_id, $scope.campaignsBacked[i].campaignid);
      }
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: data.length,
        sorting: {
          'title': 'asc'
        }
      }, {
        counts: [],
        total: data.length,
        getData: function ($defer, params) {
          // use build-in angular filter
          var orderedData = params.sorting() ?
            $filter('orderBy')(data, params.orderBy()) : data;
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    });

    backendService.getUserCampaigns(userid)
      .success(function(data) {
        $scope.myCampaigns = data;
        for (var i = 0; i < $scope.myCampaigns.length; i++) {
          var accountNo = data[i].account_id;

          $scope.getCampaignBalance(accountNo, $scope.myCampaigns[i]);
        }
      })
      .error(function(error, status, header, config) {
        //not cool to redirect the user if any error occured, should be improved by
        //checking for the exact error act base on the error
        $location.path('/');
      });

    $scope.getCampaignBalance = function(account, destination) {
      subledgerServices.getBalance(account, function(response) {
        destination.raised = response;
        $scope.$digest();
      });
    };

    $scope.getCurrentBalance = function(account, destination) {
      subledgerServices.getBalance(account, function(response) {
        destination.amount = response;
        $scope.$digest();
      });
    };

    $scope.getCurrentBalance(cred.bank_id, $scope.systemBalance);
    $scope.getCurrentBalance($scope.authentication.user.account_id, $scope.balance);

    //GET UNIQUE USER JOURNAL REPORTS
    $scope.getJournals = function(account, cb) {
      subledgerServices.getJournals(account, function(response) {
        response = response.posted_lines;
        cb(response);
      });
    };

    /*
        This is the method that fetches the  transaction journal for the banker using the bank id
        If the Authenticated User plays Both Role of A banker and a Distributor the Data will have the same values 
    */
    $scope.getJournals(cred.bank_id, function(response) {
      $scope.journal = response;
      $scope.$digest();
    });

    //This is the method that loads the Transaction journal for the Authenticated User.
    $scope.getJournals($scope.authentication.user.account_id, function(response) {
      $scope.myJournal = response;
      $scope.$digest();
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
  }
]);
