'use strict';

var subledgerCred = require('./../../config/env/' + process.env.NODE_ENV).subledger;
var Subledger = require('subledger').Subledger;
var subledger = new Subledger();

var identity_id = 'PNKWmtgMsLoHzB4LhUw4qN';
var org_id = 'EpXxbhcVpxyC8BH0icuIQF';
var book_id = 'R6WkhSAmw4STDyGHbrrFJL';
subledger.setCredentials(subledgerCred.key_id, subledgerCred.secret_id);

exports.getIdentity = function (req, res) {
  subledger.identity(subledgerCred.identity_id).get(function (error, apiRes) {
    if (error) {
      // return error;
      return res.json(error);

    } else {
      return res.json(apiRes);
    }
  });
};

//create a new account for every new user --params are passed at the point of authentication (user.authentication.server.contoller) also create a new account for every new campaign
exports.createAccount = function (data, done) {
  subledger.organization(subledgerCred.org_id).book(subledgerCred.book_id).account().create(data, done);
};

//get all Accounts 
exports.getAllAccounts = function (req, res) {
  subledger.organization(subledgerCred.org_id).book(subledgerCred.book_id).account().get({
    'description': 'USD'
  }, function (error, apiRes) {
    if (error) {
      return res.json(error);
    } else {
      return res.json(apiRes);
    }
  });
};

//get a single accounts
exports.getUniqueAccount = function (req, res) {
  var account_id = req.params.account_id;
  subledger.organization(subledgerCred.org_id).book(subledgerCred.book_id).account(account_id).get({
    'description': 'USD'
  }, function (error, apiRes) {
    if (error) {
      return res.json(error);
    } else {
      return res.json(apiRes);
    }
  });
};
// add authentication to the route and call this method in the frontend 
exports.getConstants = function (req, res) {
  return res.json(subledgerCred);
};

exports.archiveCampaignAccount = function (account_id, cb) {
  subledger.organization(subledgerCred.org_id).book(subledgerCred.book_id).account(account_id).archive(function (error, apiRes) {
    cb(error, apiRes);
  });
};

exports.creditUserAccount = function (action, amount, initiatorAccount, recipientAccount, title, cb) {
  var otherAction = action === 'debit' ? 'credit' : 'debit';

  var description = 'Cash refund from deleted campaign';
  var initiatorToString = JSON.stringify({
    title: title,
    description: description
  });

  subledger.organization(subledgerCred.org_id).book(subledgerCred.book_id).journalEntry().createAndPost({
    'effective_at': new Date().toISOString(),
    'description': initiatorToString,
    'reference': 'http://andonation-mando.herokuapp.com',
    'lines': [{
      'account': recipientAccount,
      'description': initiatorToString,
      'reference': 'http://andonation-mando.herokuapp.com',
      'value': {
        'type': action,
        'amount': amount
      }
    }, {
      'account': initiatorAccount,
      'description': initiatorToString,
      'reference': 'http://andonation-mando.herokuapp.com',
      'value': {
        'type': otherAction,
        'amount': amount
      }
    }]
  }, function (error, apiRes) {
    cb(error, apiRes);
  });
};

