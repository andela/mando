'use strict';
/*global Subledger*/

angular.module('banker').factory('bankerFactory', ['$http', function($http) {
  var subledger = new Subledger();
  var credentials = {};


  var setCredentials = function(key_id, secret) {
    subledger.setCredentials(key_id, secret);
  };
  var getSystemBalance = function(org_id, book_id, account_id) {
    return subledger.organization(org_id).book(book_id).account(account_id);
  };

  var createAndPostTransaction = function(org_id, book_id) {
    return subledger.organization(org_id).book(book_id).journalEntry();
  };

  var getJournalReports = function(org_id, book_id, account_id) {
    return subledger.organization(org_id).book(book_id).account(account_id).line();
  };
  var getCredentials = function() {
    return $http.get('/bank/credentials').success(function(data, error) {
      if (error) {
        return error;
      } else {
        credentials = data;
      }
    });
  };
  return {
    getSystemBalance: getSystemBalance,
    createAndPostTransaction: createAndPostTransaction,
    getJournalReports: getJournalReports,
    getCredentials: getCredentials,
    setCredentials: setCredentials
  };
}]);
