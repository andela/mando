'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl', ['$scope', 'Authentication', '$http', '$timeout', 'toaster', '$modal', 'subledgerServices', 'lodash', 'credentials', '$state', function($scope, Authentication, $http, $timeout, toaster, $modal, subledgerServices, lodash, credentials, $state) {

  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'banker', 'userCampaigns');
  $scope.reports = [];
  $scope.journal = [];
  $scope.withdrawal = {};
  $scope.balance = {
    amount: ''
  };

  // Check if the user has a banker role.
  $scope.isBanker = Authentication.hasRole('banker');

  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  subledgerServices.setCredentials(cred);
  $scope.authentication = Authentication;

  //Method to Get The Bank Balance

  $scope.getBankBalance = function(account) {
    subledgerServices.getBalance(account, function(response) {
      $scope.balance.amount = response;
      $scope.$digest();
    });
  };
  $scope.getBankBalance(cred.bank_id);

  //get All lines of transaction
  $scope.getJournals = function(account) {
    subledgerServices.getJournals(account, function(response) {
      $scope.journal = response.posted_lines;
      console.log(2, response);
      $scope.$digest();
    });
  };
  $scope.getJournals(cred.bank_id);


  //Grab Some details of the Auhtenticated user and convert it to a string which will be stored in subledger the returned string is converted back into an object.

  $scope.withdrawFromBank = function(amount, user) {
    subledgerServices.bankerAction('debit', amount, cred.system_id, cred.bank_id, $scope.authentication.user, function() {
      $scope.getBankBalance(cred.bank_id);
      $scope.getJournals(cred.bank_id);
    });
  };

  $scope.depositIntoBank = function(amount, user) {
    subledgerServices.bankerAction('credit', amount,cred.system_id ,cred.bank_id, $scope.authentication.user, function() {
      $scope.getBankBalance(cred.bank_id);
      $scope.getJournals(cred.bank_id);
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
