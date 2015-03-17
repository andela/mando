'use strict';
/*global Subledger*/

angular.module('banker').factory('subledgerServices', ['$http', 'toaster', function($http, toaster) {
  var subledger = new Subledger();
  var credentials = {};
  var cred = {};

  var setCredentials = function(data) {
    subledger.setCredentials(data.key_id, data.secret_id);
    cred = data;

  };

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
    return $http.get('/bank/credentials').success(function(data, status, header, config) {
      credentials = data;
    });
  };


  //Get SystemBalance
  var getBalance = function(account, cb) {
    var date = new Date().toISOString();
    getSystemBalance(cred.org_id, cred.book_id, account).balance({
      description: 'USD',
      at: date
    }, function(error, apiRes) {
      if (error) {
        // toaster.pop('error', 'An Error Occurred' + error);
        return error;
      } else {
        var amount = parseInt(apiRes.balance.value.amount);
        cb(amount);
      }
    });
  };

  /*  WITHDRAW and DEPOSIT in and Out of the Syetem.
    Performs Crediting and Debiting of Accounts  
    Action == credit or Debit
    transaction = {
     amount: Amount to Credit/Debit
     reason : Reason for Debiting or Crediting If Its from a Distributor to a User other transactions do not have reasons
       
    }
    inititorAccount ="Account that initiated the transaction which can be a banker"
    recipientAccoutn = "Accoutn that accepts the transation"
    initiatorl: this is the logged in user that authorises the transaction.
    cb : callback
  */
  var bankerAction = function(action, transaction, initiatorAccount, recipientAccount, initiator, cb) {
    var otherAction = action === 'debit' ? 'credit' : 'debit';

    var description = (action === 'debit') ? transaction.reason || 'Cash Withrawal from Bank' : transaction.reason || 'Cash Deposit To Bank';
    var initiatorToString = JSON.stringify({
      name: initiator.displayName,
      email: initiator.email,
      description: description
    });

    createAndPostTransaction(cred.org_id, cred.book_id).createAndPost({
      'effective_at': new Date().toISOString(),
      'description': initiatorToString,
      'reference': 'http://andonation-mando.herokuapp.com',
      'lines': [{
        'account': recipientAccount,
        'description': initiatorToString,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': action,
          'amount': transaction.amount
        }
      }, {
        'account': initiatorAccount,
        'description': initiatorToString,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': otherAction,
          'amount': transaction.amount
        }
      }]
    }, function(error, apiRes) {
      if (error) {
        return error;
      } else {
        cb(apiRes);
      }
    });
  };

  //Get Journal Reports for any Transaction.
  // PARAMs  account to get the journal and a callback
  var getJournals = function(account, cb) {
    getJournalReports(cred.org_id, cred.book_id, account).get({
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
        cb(apiRes);
      }
    });
  };


  return {
    getSystemBalance: getSystemBalance,
    createAndPostTransaction: createAndPostTransaction,
    getJournalReports: getJournalReports,
    getCredentials: getCredentials,
    setCredentials: setCredentials,
    getBalance: getBalance,
    bankerAction: bankerAction,
    getJournals: getJournals
  };
}]);
