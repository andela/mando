'use strict';
angular.module('campaign').controller('viewCampaignCtrl', ['credentials', '$scope', 'toaster', 'backendService', '$location', 'Authentication', '$stateParams', '$modal', 'subledgerServices', 'ngTableParams', '$filter', '$timeout', 'progressBarService',
  function (credentials, $scope, toaster, backendService, $location, Authentication, $stateParams, $modal, subledgerServices, ngTableParams, $filter, $timeout, progressBarService) {
    var campaignBalance, userAccountBalance;
    $scope.buttonValue = 'SUPPORT';
    $scope.authentication = Authentication;
    var cred = credentials.data;
    subledgerServices.setCredentials(cred);
    var getCampaigns = function() {
      backendService.getCampaign($stateParams.campaignTimeStamp + '/' + $stateParams.campaignslug)
      .success(function (data, status, header, config) {
        $scope.campaign = data;
        if($scope.campaign.status === 'funded') {
          $scope.buttonValue = 'FUNDED';
          $scope.daysLeft = 'none';
        }
        else if($scope.campaign.status === 'expired') {
          $scope.buttonValue = 'EXPIRED';
        }
        $scope.dateFunded = $scope.campaign.dateFunded;
        getCampaignBalance($scope.campaign.account_id);
        getUserAccountBalance(Authentication.user.account_id);
        getCampaignBackersHistory(data._id);
        var currentDate = new Date(Date.now());
        var campaignDeadline = new Date($scope.campaign.dueDate);
        $scope.daysLeft = Math.ceil((campaignDeadline - currentDate)/(1000 * 3600 * 24));
        if($scope.daysLeft >= 10) {
          $scope.deadlineStyle = 'success';
        }
        else if($scope.daysLeft > 5 && $scope.daysLeft < 10) {
          $scope.deadlineStyle = 'warning';
        }
        else if($scope.daysLeft <= 5 && $scope.daysLeft >= 0) {
          $scope.deadlineStyle = 'danger';
        }
        else if($scope.daysLeft < 0) {
          $scope.daysLeft = 'none';
        }
        if($scope.authentication.user._id === $scope.campaign.createdBy._id) {
          $scope.ownCampaign = true;
        }
      })
      .error(function (error, status, header, config) {
        $location.path('/');
      });
    };
    getCampaigns();
    var getCampaignBackersHistory = function (campaignid) {
      backendService.getCampaignBackers(campaignid).success(function (data) {
        $scope.campaignBackers = data;
        $scope.tableParams = new ngTableParams({
          page: 1,
          count: data.length,
          sorting: {
            'userid.displayName': 'asc'
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
    };
    var getUserAccountBalance = function (userAccountid) {
      subledgerServices.getBalance(userAccountid, function (response) {
        userAccountBalance = response;
      });
    };
    var updateProgressbar = function () { 
      progressBarService.updateProgressBar($scope.campaignBalance, $scope.campaign.amount, function(fundRaised, campaignFundPercentage) {
        $scope.fundsRaised = fundRaised;
        $scope.campaignFundPercentage = campaignFundPercentage;
      });  
    };
    var getCampaignBalance = function (campaignAccountid) {
      subledgerServices.getBalance(campaignAccountid, function (response) {
        $timeout(function() {
          $scope.campaignBalance = response;
            updateProgressbar();
            getCampaigns();
        });
      });
    };
    $scope.openModal = function () {
      if($scope.authentication.user._id === $scope.campaign.createdBy._id) {
        $scope.modalInstance = $modal.open({
          templateUrl: 'modules/campaigns/views/supportOwnCampaign.modal.client.view.html'
        });
        return;
      }
      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/campaigns/views/supportCampaign.modal.client.view.html',
        controller: 'supportCampaignCtrl',
        size: 'sm',
        resolve: {
          campaign: function () {
            return {
              accountid: $scope.campaign.account_id,
              id: $scope.campaign._id
            };
          },
          amountNeeded: function () {
            return $scope.campaign.amount;
          },
        }
      });
      $scope.modalInstance.result.then(function (status) {
        backendService.getCampaign($stateParams.campaignTimeStamp + '/' + $stateParams.campaignslug)
          .success(function (data, status, header, config) {
            toaster.pop('success', 'Success! - Thanks for supporting this campaign');
            $scope.campaign = data;
            getCampaignBalance($scope.campaign.account_id);
            getCampaignBackersHistory(data._id);
            getUserAccountBalance(Authentication.user.account_id);
          });
      });
    };
  }
]);