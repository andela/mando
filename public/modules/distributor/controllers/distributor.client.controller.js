
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
  //method to credit each account
  $scope.depositIntoUser = function(transaction, user) {
    var confirmMsg = confirm('Are you sure you want to credit '+ user.displayName);
    if(confirmMsg) {
      subledgerServices.bankerAction('credit', transaction, cred.bank_id, user.account_id, $scope.authentication.user, function() {
        toaster.pop('success', 'credited successfully');
        $scope.getUsers();
        });
    }
  };

  //method to debit each user account
  $scope.withdrawFromUser = function(transaction, user) {
    var confirmMsg = confirm('Are you sure you want to credit '+ user.displayName);
    // Compare with user balance
    if (transaction.amount > user.amount) {
      toaster.pop('error', 'Balance is insufficient');
      return;
      }
      if(confirmMsg) {
    subledgerServices.bankerAction('debit', transaction, cred.bank_id, user.account_id, $scope.authentication.user, function() {
      toaster.pop('success', 'Withdrawal successful');
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