'use strict';

  var users = require('../../app/controllers/users.server.controller'),
    adminRoles = require('../../app/controllers/admin/roles.server.controller.js'),
    adminUsers = require('../../app/controllers/admin/users.server.controller.js');

module.exports = function(app) {
  app.route('/admin/*').all(users.requiresLogin);
  app.route('/admin/role/add').post(adminRoles.addRoles);
  app.route('/admin/roles').get(adminRoles.getRoles);
  app.route('/admin/user/role').post(adminRoles.getRoles);
  app.route('/admin/users').get(adminUsers.getUsers);
  app.route('/admin/user/role/add').post(adminRoles.addUserRoles);
};