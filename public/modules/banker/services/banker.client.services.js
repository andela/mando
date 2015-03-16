'use strict';
/*global Subledger*/

angular.module('banker').factory('bankerFactory', ['$http', function($http) {
  var subledger = new Subledger();
  var credentials = {};
  var cred = {};

  var setCredentials = function(data) {
    console.log(data);
    subledger.setCredentials(data.key_id, data.secret_id);
    cred = data;

  };

  // var setCredentials = function(key_id, secret) {
  //   subledger.setCredentials(key_id, secret);
  // };
  var getSystemBalance = function(org_id, book_id, account_id) {
    return subledger.organization(org_id).book(book_id).account(account_id);
  };

  var createAndPostTransaction = function(org_id, book_id) {
    return subledger.organization(org_id).book(book_id).journalEntry();
  };

  var getJournalReports = function(org_id, book_id, account_id) {
    var org = subledger.organization(org_id);
    var book = org.book(book_id);
    var account = book.account(account_id);
    return account.line();
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

  var bankerAction = function(action, amount,  banker, cb) {
    var otherAction = action === 'debit' ? 'credit' : 'debit';
    var description = (action === 'debit') ? 'Cash Widrawal From Bank' : 'Cash Deposit To Bank';

    var bankerToString = JSON.stringify({
      name: banker.displayName,
      email: banker.email,
      description: description
    });

    createAndPostTransaction(cred.org_id, cred.book_id).createAndPost({
      'effective_at': new Date().toISOString(),
      'description': bankerToString,
      'reference': 'http://andonation-mando.herokuapp.com',
      'lines': [{
        'account': cred.bank_id,
        'description': bankerToString,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': action,
          'amount': amount
        }
      }, {
        'account': cred.system_id,
        'description': bankerToString,
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
        cb();
      }
    });
  };

  return {
    getSystemBalance: getSystemBalance,
    createAndPostTransaction: createAndPostTransaction,
    getJournalReports: getJournalReports,
    getCredentials: getCredentials,
    setCredentials: setCredentials,
    bankerAction: bankerAction
  };
}]);
