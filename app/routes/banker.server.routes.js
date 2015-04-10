'use strict';
var userAuth = require('../../app/controllers/users/users.authorization.server.controller');
var banker = require('../controllers/banker.server.controller');
var users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
  app.route('/bank/identity').get(users.hasAuthorization('banker'),banker.getIdentity);
  app.route('/bank/accounts').get(users.hasAuthorization('banker'),banker.getAllAccounts);
  app.route('/bank/accounts/:account_id').get(users.hasAuthorization('banker'), banker.getUniqueAccount);
  app.route('/bank/credentials').get(banker.getConstants);
};
