'use strict';

var allUsers = require('../../app/controllers/distributor.server.controller.js');

module.exports = function(app) {
  app.route('/distributor/users').get(allUsers.getUsers);
  app.route('/distributor/getByUsername/:username').get(allUsers.getByUsername);
};