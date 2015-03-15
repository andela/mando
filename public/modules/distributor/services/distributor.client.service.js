'use strict';
/*global Subledger*/

//This is just a repetition of the apis made in banker

angular.module('distributor').factory('distributorService', ['$http', function($http) {
  var subledger = new Subledger();
  var credentials = {};


  var setCredentials = function(key_id, secret) {
    subledger.setCredentials(key_id, secret);
  };
  var getAccountBalance = function(org_id, book_id, account_id) {
    return subledger.organization(org_id).book(book_id).account(account_id);
  };

  var createAndPostTransaction = function(org_id, book_id) {
    return subledger.organization(org_id).book(book_id).journalEntry();
  };

  var getJournalReports = function(org_id, book_id, account_id) {
    return subledger.organization(org_id).book(book_id).account(account_id).line();
  };
  var getAllUsers = function() {
    return $http.get('/distributor/users');
  };
  return {
    getAccountBalance: getAccountBalance,
    createAndPostTransaction: createAndPostTransaction,
    getJournalReports: getJournalReports,
    getAllUsers: getAllUsers,
    setCredentials: setCredentials
  };
}]);