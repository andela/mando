'use strict';
angular.module('campaign').controller('userTransactionCtrl', ['$scope', '$http', '$state', 'subledgerServices', 'Authentication', 'credentials', function($scope, $http, $state, subledgerServices, Authentication, credentials) {
  $scope.authentication = Authentication;
  $scope.journal = {};
  $scope.balance = {};

  Authentication.requireLogin($state);
  var cred = credentials.data;
  subledgerServices.setCredentials(cred);
  $scope.authentication = Authentication;

  //Get the User Transaction Details from Subledger
  var getCurrentBalance = function(account, destination) {
    subledgerServices.getBalance(account, function(response) {
      destination.amount = response;
      $scope.$digest();
    });
  };
  getCurrentBalance($scope.authentication.user.account_id, $scope.balance);

  var getJournals = function(account) {
    subledgerServices.getJournals(account, function(response) {
      $scope.journal = response.posted_lines;
       $scope.$digest();
    });
  };
  getJournals($scope.authentication.user.account_id);
}]);


