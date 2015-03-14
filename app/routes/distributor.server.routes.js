'use strict';

var allUsers = require('../../app/controllers/distributor/distributor.server.controller.js');

module.exports = function(app) {
  app.route('/distributor/users').get(allUsers.getUsers);
};