'use strict';
var Subledger = require('subledger').Subledger;
var subledger = new Subledger();

var identity_id = 'PNKWmtgMsLoHzB4LhUw4qN';
var org_id = 'EpXxbhcVpxyC8BH0icuIQF';
var book_id = 'R6WkhSAmw4STDyGHbrrFJL';
subledger.setCredentials('2lzQysbyNXhPgYxx8pp2vE','CJzZPwRw01thgquyeD6RYc');

exports.getIdentity = function(req, res) {
  subledger.identity(identity_id).get(function (error, apiRes){
    if (error) {
      // return error;
      return res.json(error);

    } else {
      return res.json(apiRes);
    }
  });
};

//create a new account for every new user --params are passed at the point of authentication (user.authentication.server.contoller) also create a new account for every new campaign
exports.createAccount = function(data, done) {
  subledger.organization(org_id).book(book_id).account().create(data, done);
};

//get all Accounts 
exports.getAllAccounts =function(req, res) {
  subledger.organization(org_id).book(book_id).account().get({'description': 'USD'},function (error, apiRes){
    if(error){
      return res.json(error);
    }else {
      return res.json(apiRes);
    }
  });
};

//get a single accounts
exports.getUniqueAccount = function (req, res){
  var account_id = req.params.account_id ;
  subledger.organization(org_id).book(book_id).account(account_id).get({'description': 'USD'},function (error,apiRes){
   if(error){
      return res.json(error);
    }else {
      return res.json(apiRes);
  }
});

  exports.getConstants = function(req, res){
    var datas ={
    identity_id : 'PNKWmtgMsLoHzB4LhUw4qN',
    org_id : 'EpXxbhcVpxyC8BH0icuIQF',
    book_id : 'R6WkhSAmw4STDyGHbrrFJL',
    key_id: '2lzQysbyNXhPgYxx8pp2vE',
    secret_id: 'CJzZPwRw01thgquyeD6RYc',
    Bank_id: '6HNEAjoyxWtXjVXD2TyZqE',
    system_id: 'E8GtyKhrPjSduG8aHSUusc',
    };
    return res.json(datas);
  };
};



