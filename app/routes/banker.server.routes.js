'use strict';
var userAuth = require('../../app/controllers/users/users.authorization.server.controller');
var banker = require('../controllers/banker.server.controller');
var users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
  app.route('/bank/*').all(users.hasAuthorization('banker'));
  app.route('/bank/identity').get(banker.getIdentity);
  app.route('/bank/accounts').get(banker.getAllAccounts);
  app.route('/bank/accounts/:account_id').get(banker.getUniqueAccount);
  app.route('/bank/credentials').get(banker.getConstants);
};
