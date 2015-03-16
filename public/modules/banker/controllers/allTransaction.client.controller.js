'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl', ['$scope', 'Authentication', '$http', '$timeout', 'toaster', '$modal', 'bankerFactory', 'lodash', 'credentials', '$state', function($scope, Authentication, $http, $timeout, toaster, $modal, bankerFactory, lodash, credentials, $state) {

  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'admin', 'userCampaigns');
  $scope.reports = [];
  $scope.withdrawal = {};
  $scope.balance = {
    amount: ''
  };
  // Check if the user has a banker role.
  $scope.isBanker = Authentication.hasRole('banker');

  var cred = credentials.data;
  bankerFactory.setCredentials(cred.key_id, cred.secret_id);

  $scope.authentication = Authentication;

  //Method to Get The Bank Balance
  $scope.getBalance = function() {
    var date = new Date().toISOString();
    bankerFactory.getSystemBalance(cred.org_id, cred.book_id, cred.bank_id).balance({
      description: 'USD',
      at: date
    }, function(error, apiRes) {
      if (error) {
        toaster.pop('error', 'An Error Occurred' + error);
        return;
      } else {
        var amount = parseInt(apiRes.balance.value.amount);
        $scope.balance.amount = amount;
      }
    });
  };
  $scope.getBalance();

  //get All lines of transaction
  $scope.getJournals = function(cb) {
    bankerFactory.getJournalReports(cred.org_id, cred.book_id, cred.bank_id).get({
      'description': 'USD',
      'action': 'before',
      'effective_at': new Date().toISOString()
    }, function(error, apiRes) {
      if (error) {
        return error;
      } else {
        for (var i = 0; i < apiRes.posted_lines.length; i++) {
          try {
            var stringToObj = JSON.parse(apiRes.posted_lines[i].description);
            apiRes.posted_lines[i].description = stringToObj;
          } catch (e) {
            apiRes.posted_lines[i].description = {
              'name': 'anonymous',
              'description': apiRes.posted_lines[i].description
            };
          }
        }
        $scope.journal = apiRes.posted_lines;
        $scope.$digest();
        if (!!cb) {
          cb();
        }
      }
    });
  };
  $scope.getJournals();

  //Grab Some details of the Auhtenticated user and convert it to a string which will be stored in subledger the returned string is converted back into an object.

  $scope.withdrawFromBank = function(amount) {
    var userToString = {
      name: $scope.authentication.user.displayName,
      email: $scope.authentication.user.email,
      description: 'Cash Withdrawal'
    };
    var userdetails = JSON.stringify(userToString);
    bankerFactory.createAndPostTransaction(cred.org_id, cred.book_id).createAndPost({
      'effective_at': new Date().toISOString(),
      'description': userdetails,
      'reference': 'http://andonation-mando.herokuapp.com',
      'lines': [{
        'account': cred.bank_id,
        'description': userdetails,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': 'debit',
          'amount': amount
        }
      }, {
        'account': cred.system_id,
        'description': 'Cash Deposit',
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': 'credit',
          'amount': amount
        }
      }]
    }, function(error, apiRes) {
      if (error) {
        return error;
      } else {
        var StringToObj = JSON.parse(apiRes.posting_journal_entry.description);
        $scope.getBalance();
        $scope.getJournals();
      }
    });
  };

  $scope.depositIntoBank = function(amount) {
    var userToString = {
      name: $scope.authentication.user.displayName,
      email: $scope.authentication.user.email,
      description: 'Cash Deposit'
    };
    var userdetails = JSON.stringify(userToString);
    bankerFactory.createAndPostTransaction(cred.org_id, cred.book_id).createAndPost({
      'effective_at': new Date().toISOString(),
      'description': userdetails,
      'reference': 'http://andonation-mando.herokuapp.com',
      'lines': [{
        'account': cred.bank_id,
        'description': userdetails,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': 'credit',
          'amount': amount
        }
      }, {
        'account': cred.system_id,
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
        $scope.getBalance();
        $scope.getJournals();
      }
    });
  };
  // OPEN MODAL WINDOW
  $scope.openModalWithdraw = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/banker/views/withdraw.modal.view.html',
      controller: 'withdrawalModalInstanceCtrl',
      size: size,
      resolve: {
        transaction: function() {
          return $scope.balance.amount;
        }
      }
    });
    modalInstance.result.then(function(amount) {
      $scope.withdrawFromBank(amount);
      toaster.pop('success', 'Transaction Completed');
    });
  };
  //OPEN MODAL WINDOW
  $scope.openModalDeposit = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/banker/views/deposit.modal.view.html',
      controller: 'depositModalInstanceCtrl',
      size: size
    });
    modalInstance.result.then(function(amount) {
      $scope.depositIntoBank(amount);
      toaster.pop('success', 'Transaction Completed');

    });
  };

}]);
