'use strict';
/*global Subledger*/

angular.module('banker').constant('bankerConstant', {
  BANK_ID: '6HNEAjoyxWtXjVXD2TyZqE',
  SYSTEM_ID: 'E8GtyKhrPjSduG8aHSUusc',
})
.factory('bankerFactory', [ function(){
  var subledger = new Subledger();
  var identity_id = 'PNKWmtgMsLoHzB4LhUw4qN';
  var org_id = 'EpXxbhcVpxyC8BH0icuIQF';
  var book_id = 'R6WkhSAmw4STDyGHbrrFJL';
  subledger.setCredentials('2lzQysbyNXhPgYxx8pp2vE','CJzZPwRw01thgquyeD6RYc');
  
    var getSystemBalance = function (account_id){
      return subledger.organization(org_id).book(book_id).account(account_id);
    };

    var createAndPostTransaction = function (){
     return subledger.organization(org_id).book(book_id).journalEntry();
    };

    var getJournalReports = function(account_id){
       return subledger.organization(org_id).book(book_id).account(account_id).line();
    };

    var getReports = function(){
       return subledger.organization(org_id).book(book_id).report();
    };

    return {
      getSystemBalance: getSystemBalance,
      createAndPostTransaction: createAndPostTransaction,
      getJournalReports: getJournalReports,
      getReports: getReports
    };
  }]);