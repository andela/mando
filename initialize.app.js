'use strict';

require('./app/models/user.server.model.js');
require('./app/models/role.server.model.js');

// var config = require('./config/env/' + process.env.NODE_ENV);
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Role = mongoose.model('Role');


mongoose.connect('mongodb://localhost/andonation');

var adminEmail = process.argv[2];

var shutdown = function () {
  mongoose.connection.close();
  process.exit();
};

var addRoleToAdmin = function(adminid, rolesid) {
  User.findByIdAndUpdate(adminid, {roles: [rolesid]}, function(err, user) {
    if (err) {
      console.log('Error when updating admin role', err);
      shutdown();
    }
    console.log('Done updating user');
    console.log('Bye Bye');
    shutdown();
  });
};

var createRoles = function (adminid) {
  Role.create({
      roleType: 'member',
      createdBy: adminid,
      created: Date.now()
    }, {
      roleType: 'admin',
      createdBy: adminid,
      created: Date.now()
    }, {
      roleType: 'distributor',
      createdBy: adminid,
      created: Date.now()
    }, {
      roleType: 'banker',
      createdBy: adminid,
      created: Date.now()
    }, function(err, member, admin) {
      if (err) {
        console.log('error when creating roles', err);
        shutdown();
      }
      console.log('Member, Admin, Distributor, Banker Roles created');
      addRoleToAdmin(adminid, admin._id);
    });
};

var createAdmin = function (adminEmail) {
  User.create({
    email: adminEmail
  }, function (err, data) {
    if (err) {
      console.log('Error when creating admin', err);
      shutdown();
    }
    console.log('1. Admin created');
    createRoles(data._id);
  });
};

(function() {
  createAdmin(adminEmail);
})();