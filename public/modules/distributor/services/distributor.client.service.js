'use strict';
/*global Subledger*/

//This is just a repetition of the apis made in banker

angular.module('distributor').factory('distributorService', ['$http', function($http) {
  var subledger = new Subledger();
  var cred = {};


  var setCredentials = function(data) {
    console.log(data);
    subledger.setCredentials(data.key_id, data.secret_id);
    cred = data;
    //subledger.setCredentials(key_id, secret);
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

  //method to credit each account
 var depositorAction = function(action, amount, user, adminUser, cb) {
    var otherAction = action === 'debit' ? 'credit' : 'debit';
    var description = (action === 'debit') ? 'Cash Deposit To Bank' : 'Cash Widrawal From Bank';

    var adminUserString = JSON.stringify({
      name: adminUser.displayName,
      email: adminUser.email,
      description: description
    });

    var userString = JSON.stringify({
      name: user.displayName,
      email: user.email,
      description: description
    });

    createAndPostTransaction(cred.org_id, cred.book_id).createAndPost({
      'effective_at': new Date().toISOString(),
      'description': userString,
      'reference': 'http://andonation-mando.herokuapp.com',
      'lines': [{
        'account': user.account_id,
        'description': userString,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': action,
          'amount': amount
        }
      }, {
        'account': cred.bank_id,
        'description': adminUserString,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': otherAction,
          'amount': amount
        }
      }]
    }, function(error, apiRes) {
      if (error) {
        return error;
      } else {
        cb()
;
      }
    });
  };

  return {
    getAccountBalance: getAccountBalance,
    createAndPostTransaction: createAndPostTransaction,
    getJournalReports: getJournalReports,
    getAllUsers: getAllUsers,
    setCredentials: setCredentials,
    depositorAction: depositorAction
  };
}]);