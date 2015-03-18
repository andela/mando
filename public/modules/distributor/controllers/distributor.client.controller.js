'use strict';

angular.module('distributor').controller('distributorCtrl', ['$scope', 'Authentication', 'subledgerServices', 'distributorServices', '$location', '$state', '$modal', 'toaster', 'credentials', function($scope, Authentication, subledgerServices, distributorServices, $location, $state, $modal, toaster, credentials) {

  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  $scope.authentication = Authentication;
  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'distributor', 'userCampaigns');

  //Get All The Users Inn the System ANd populates it with their System Balance...
  $scope.getUsers = function() {
    distributorServices.getAllUsers().success(function(data) {
      $scope.users = data;
      for (var i = 0; i < $scope.users.length; i++) {
        var accountNo = data[i].account_id;
        $scope.getCurrentBalance(accountNo, $scope.users[i]);
      }
    }).error(function(error) {
      $scope.error = error;
    });
  };
  $scope.getUsers();
  //Method to populate each user's account with their system balance

  $scope.getCurrentBalance = function(account, destination) {
    subledgerServices.getBalance(account, function(response) {
      destination.amount = response;
      $scope.$digest();
    });
  };

  $scope.depositIntoUser = function(amount, user) {

    var confirmMsg = confirm('Are you sure you want to credit '+ user.displayName);
    if(confirmMsg) {
      toaster.pop('success', 'Credited successful');
      distributorServices.depositorAction('credit', amount, user, $scope.authentication.user, function() {
      $scope.getUsers();
    });
  }
  };

  //method to debit each user account
  $scope.withdrawFromUser = function(transaction, amount, user) {
    // Compare with user balance
    if (transaction.amount > user.amount) {
      toaster.pop('error', 'Balance is insufficient');
      return;
    }

    var confirmMsg = confirm('Are you sure you want to withdraw from ' + user.displayName);
    if(confirmMsg) {
      toaster.pop('success', 'Withdrawal successful');
      distributorServices.depositorAction('debit', amount, user, $scope.authentication.user, function() {
      $scope.getUsers();
    });
    }
  };

  $scope.distributorModal = function(user, cb) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/distributor/views/distributor.modal.client.view.html',
      controller: 'disModalInstanceCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function(transaction) {
      cb(transaction, user);
    });
  };
}]);
