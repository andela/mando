'use strict';

angular.module('distributor').controller('distributorCtrl', ['$scope', 'Authentication', 'distributorService', '$location', '$state', '$modal', 'toaster', 'credentials', function($scope, Authentication, distributorService, $location, $state, $modal, toaster, credentials) {

  var cred = credentials.data;
  distributorService.setCredentials(cred);

  $scope.authentication = Authentication;
  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'distributor', 'userCampaigns');

  //Get All The Users Inn the System ANd populates it with their System Balance...
  $scope.getUsers = function () {
  distributorService.getAllUsers().success(function(data) {
    $scope.users = data;
    for (var i = 0; i < $scope.users.length; i++) {
      var accountNo = data[i].account_id;
      $scope.getUserAccountBalance(accountNo, $scope.users[i]);
    }
  }).error(function(error) {
    $scope.error = error;
  });
};
$scope.getUsers();
  //Method to populate each user's account with dir system balance
  $scope.getUserAccountBalance = function(account_id, user) {
    var date = new Date().toISOString();
    distributorService.getAccountBalance(cred.org_id, cred.book_id, account_id).balance({
      description: 'USD',
      at: date
    }, function(error, apiRes) {
      if (error) {
        toaster.pop('error', 'An Error Occurred'+ error);
        return;
      }

      var amount = apiRes.balance.value.amount;
      user.currentBalance = amount;
      $scope.$digest();
    });
  };

  //method to credit each account
  $scope.depositIntoUser = function(amount, user) {
    distributorService.depositorAction('credit', amount, user, $scope.authentication.user, function() {
      $scope.getUsers();
    });
  };


  //method to debit each user account
  $scope.withdrawFromUser = function(amount, user) {
    // Compare with user balance
    if(amount > user.currentBalance) {
      toaster.pop('error', 'Balance is insufficient');
      return;
    }

    distributorService.depositorAction('debit', amount, user, $scope.authentication.user, function() {
      $scope.getUsers();
    });
  };

  $scope.distributorModal = function(user, cb) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/distributor/views/distributor.modal.client.view.html',
      controller: 'disModalInstanceCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function(amount) {
      cb(amount, user);
    });
  };
}]);