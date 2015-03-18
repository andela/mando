'use strict';

angular.module('campaign').controller('supportCampaignCtrl', ['$scope', 'campaignAccountId', 'amountNeeded', 'subledgerServices', 'Authentication', '$modalInstance', function($scope, campaignAccountId, amountNeeded, subledgerServices, Authentication, $modalInstance) {

  subledgerServices.getBalance(Authentication.user.account_id, function(response) {
    $scope.userAccountBalance = response;
    $scope.$digest();
  });
  subledgerServices.getBalance(campaignAccountId, function(response) {
    $scope.campaignBalance = response;
    $scope.$digest();
  });
  $scope.amountNeeded = amountNeeded;

  $scope.ok = function() {
    var transaction = {
      amount: $scope.amount,
      reason: 'Support campaign'
    };
    subledgerServices.bankerAction('credit', transaction, Authentication.user.account_id, campaignAccountId, Authentication.user, function() {
      $modalInstance.close(true);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancelled');
  };
}]);
