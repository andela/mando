'use strict';

angular.module('distributor').factory('distributorService', ['$http', function($http) {
  var subledger = new Subledger();
  // var credentials = {};

  var getAccountBalance = function(org_id, book_id, account_id) {
    return subledger.organization(org_id).book(book_id).account(account_id);
  };
  var creditUserAccount = function() {};
  var getAllUsers = function() {
    return $http.get('/distributor/users');
  };
  return {
    getAllUsers: getAllUsers,
    getAccountBalance: getAccountBalance,
    creditUserAccount: creditUserAccount
  };
}]);