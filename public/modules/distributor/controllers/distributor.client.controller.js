'use strict';

angular.module('distributor').controller('distributorCtrl', ['$scope', 'Authentication', 'distributorService', '$location', '$state', '$modal', 'toaster', 'credentials', function($scope, Authentication, distributorService, $location, $state, $modal, toaster, credentials) {

  var cred = credentials.data;
  distributorService.setCredentials(cred);

  $scope.authentication = Authentication;
  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'distributor', 'userCampaigns');

  //Get All The Users Inn the System ANd populates it with their System Balance...
<<<<<<< HEAD
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
  // $scope.getCurrentBalance(cred.bank_id, $scope.systemBalance);
  // $scope.getCurrentBalance($scope.authentication.user.account_id, $scope.balance);
=======
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
>>>>>>> added toaster and confirm to withdrawal and deposit to user

  //method to credit each account
  $scope.depositIntoUser = function(amount, user) {

    var confirmMsg = confirm('Are you sure you want to credit '+ user.displayName);
    if(confirmMsg) {
      toaster.pop('success', 'Credited successful');
      distributorService.depositorAction('credit', amount, user, $scope.authentication.user, function() {
      $scope.getUsers();
    });
  }
  };


  //method to debit each user account
  $scope.withdrawFromUser = function(amount, user) {
    // Compare with user balance
    if(amount > user.currentBalance) {
      toaster.pop('error', 'Balance is insufficient');
      return;
    }

    var confirmMsg = confirm('Are you sure you want to withdraw from ' + user.displayName);
    if(confirmMsg) {
      toaster.pop('success', 'Withdrawal successful');
      distributorService.depositorAction('debit', amount, user, $scope.authentication.user, function() {
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
    modalInstance.result.then(function(amount) {
      cb(amount, user);
    });
  };
}]);
