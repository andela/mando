'use strict';

angular.module('distributor').controller('distributorCtrl', ['$scope', 'Authentication', 'distributorService', '$location', '$state', '$modal', 'toaster', 'credentials', function($scope, Authentication, distributorService, $location, $state, $modal, toaster, credentials) {

  var cred = credentials.data;
  distributorService.setCredentials(cred.key_id, cred.secret_id);
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
        toaster.pop('error', 'An Error Occurred' + error);
        return;
      } else {
        var amount = apiRes.balance.value.amount;
        user.currentBalance = amount;
        $scope.$digest();
      }
    });
  };

  //method to credit each account
  $scope.depositIntoUser = function(amount, user) {
    console.log(user);
    console.log(amount);

    var userToString = {
      name: user.displayName,
      email: user.email,
      description: 'Cash Deposit'
    };
    var userdetails = JSON.stringify(userToString);
    distributorService.createAndPostTransaction(cred.org_id, cred.book_id).createAndPost({
      'effective_at': new Date().toISOString(),
      'description': userdetails,
      'reference': 'http://andonation-mando.herokuapp.com',
      'lines': [{
        'account': user.account_id,
        'description': 'Credit Transaction',
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': 'credit',
          'amount': amount
        }
      }, {
        'account': cred.bank_id,
        'description': 'cash deposit',
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': 'debit',
          'amount': amount
        }
      }]
    }, function(error, apiRes) {
      if (error) {
        return error;
      } else {
        $scope.getUsers();
      }
    });
  };

  $scope.distributorModal = function(user) {
    // console.log(user);
    // console.log(user.firstName);
    var modalInstance = $modal.open({
      templateUrl: 'modules/distributor/views/distributor.modal.client.view.html',
      controller: 'disModalInstanceCtrl',
      size: 'sm',
      resolve: {
        transaction: function() {
          return $scope.deposit;
        }
      }
    });
    modalInstance.result.then(function(amount) {
      $scope.depositIntoUser(amount, user);
    });
  };
}]);
