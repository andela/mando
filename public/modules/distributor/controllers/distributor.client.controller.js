'use strict';

angular.module('distributor').controller('distributorCtrl', ['$scope', 'Authentication', 'subledgerServices','distributorServices', '$location', '$state', '$modal', 'toaster', 'credentials', function($scope, Authentication, subledgerServices, distributorServices ,$location, $state, $modal, toaster, credentials) {

  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  $scope.authentication = Authentication;
  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'distributor', 'userCampaigns');

  //Get All The Users Inn the System ANd populates it with their System Balance...
  $scope.getUsers = function () {
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
  // $scope.getCurrentBalance(cred.bank_id, $scope.systemBalance);
  // $scope.getCurrentBalance($scope.authentication.user.account_id, $scope.balance);


  $scope.getUserAccountBalance = function(account_id, user) {
    var date = new Date().toISOString();
    subledgerServices.getAccountBalance(cred.org_id, cred.book_id, account_id).balance({
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
  $scope.depositIntoUser = function(transaction, user) {
    subledgerServices.bankerAction('credit', transaction, cred.bank_id, user.account_id ,$scope.authentication.user, function() {
      $scope.getUsers();
    });
  };

  //method to debit each user account
  $scope.withdrawFromUser = function(transaction, user) {
    console.log(4, transaction);
    console.log('called');
    console.log(user);
    // Compare with user balance
    console.log(transaction.amount);
    if(transaction.amount > user.currentBalance) {
      console.log('here');
      toaster.pop('error', 'Balance is insufficient');
      return;
    }

    subledgerServices.bankerAction('debit', transaction, cred.bank_id, user.account_id,$scope.authentication.user, function() {
      $scope.getUsers();
    });
  };

  $scope.distributorModal = function(user, cb) {
      console.log(user);
    var modalInstance = $modal.open({
      templateUrl: 'modules/distributor/views/distributor.modal.client.view.html',
      controller: 'disModalInstanceCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function(transaction) {
      console.log(3, transaction);
      console.log(user);
      cb(transaction, user);
    });
  };
}]);