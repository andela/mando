'use strict';

angular.module('campaign').controller('supportCampaignCtrl', ['$scope', 'campaign', 'amountNeeded', 'subledgerServices', 'Authentication', '$modalInstance', 'backendService', function($scope, campaign, amountNeeded, subledgerServices, Authentication, $modalInstance, backendService) {

  subledgerServices.getBalance(Authentication.user.account_id, function(response) {
    $scope.userAccountBalance = response;
    $scope.$digest();
  });
  subledgerServices.getBalance(campaign.accountid, function(response) {
    $scope.campaignBalance = response;
    $scope.$digest();
  });
  $scope.amountNeeded = amountNeeded;

  var createCampaignBacker = function() {
    var backer = {
      amountDonated: $scope.amount,
      transactionType: 'credit',
      campaignid: campaign.id
    };
    backendService.createCampaignBacker(backer);
  };

  $scope.ok = function() {
    createCampaignBacker();
    var transaction = {
      amount: $scope.amount,
      reason: 'Support campaign'
    };
    subledgerServices.bankerAction('credit', transaction, Authentication.user.account_id, campaign.accountid, Authentication.user, function(response) {
      if (($scope.amount + $scope.campaignBalance) >= $scope.amountNeeded) {
        backendService.fundCampaign(campaign.id).success(function (response) {
          $modalInstance.close(true);
        }).error(function(err) {
          console.log("error", err);
        });
      } else {
        $modalInstance.close(true);
      }
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancelled');
  };
}]);
