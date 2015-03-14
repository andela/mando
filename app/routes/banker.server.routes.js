'use strict';
var banker = require('../controllers/banker.server.controller');
var users = require('../../app/controllers/users.server.controller');

module.exports = function(app){
  app.route('/identity').get(banker.getIdentity);
  app.route('/accounts').get(banker.getAllAccounts);
  app.route('/accounts/:account_id').get(banker.getUniqueAccount);
 // app.route('/account').get(banker.ArchiveAccount);
  app.route('/credentials').get(banker.getConstants);
};