'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['credentials', '$scope', 'toaster', 'backendService', '$location', 'Authentication', '$stateParams', '$modal', 'subledgerServices',
  function(credentials, $scope, toaster, backendService, $location, Authentication, $stateParams, $modal, subledgerServices) {
    var campaignBalance, userAccountBalance;
    $scope.authentication = Authentication;
    var cred = credentials.data;
    subledgerServices.setCredentials(cred);
    backendService.getCampaign($stateParams.campaignTimeStamp + '/' + $stateParams.campaignslug)
      .success(function(data, status, header, config) {
        $scope.campaign = data;
        getCampaignBalance($scope.campaign.account_id);
        getUserAccountBalance(Authentication.user.account_id);
      })
      .error(function(error, status, header, config) {
        $location.path('/');
      });

    var getUserAccountBalance = function(userAccountid) {
      subledgerServices.getBalance(userAccountid, function(response) {
        userAccountBalance = response;
      });
    };
    var getCampaignBalance = function(campaignAccountid) {
      subledgerServices.getBalance(campaignAccountid, function(response) {
        $scope.campaignBalance = response;
      });
    };
    $scope.openModal = function() {
      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/campaigns/views/supportCampaign.modal.client.view.html',
        controller: 'supportCampaignCtrl',
        size: 'sm',
        resolve: {
          campaign: function() {
            return {
              accountid: $scope.campaign.account_id,
              id: $scope.campaign._id
            };
          },
          amountNeeded: function() {
            return $scope.campaign.amount;
          },
        }
      });
      $scope.modalInstance.result.then(function(status) {
        backendService.getCampaign($stateParams.campaignTimeStamp + '/' + $stateParams.campaignslug)
          .success(function(data, status, header, config) {
            toaster.pop('success', 'Success! - Thanks for supporting this campaign');
            $scope.campaign = data;
            getCampaignBalance($scope.campaign.account_id);
            getUserAccountBalance(Authentication.user.account_id);
          });
      });
    };
  }
]);
