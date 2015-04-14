//552c38efc7768681298323fc

'use strict';
require('./app/models/user.server.model.js');
require('./app/models/role.server.model.js');
var config = require('./config/env/development');
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Role = mongoose.model('Role');

mongoose.connect(config.db);
var id = process.argv[2];
var role = process.argv[3];

var addRoles = function(role, userid) {
  Role.create({roleType: role, createdBy: mongoose.Types.ObjectId(userid)}, function(err, role) {
    if (err) {
      console.log(err);
      mongoose.connection.close();
      process.exit()
    }
    console.log(role)
    // User.findByIdAndUpdate(userid, {roles: [role._id]}, function(err, user) {
    //   if (err) {
    //     console.log(err);
    //     mongoose.connection.close();
    //     process.exit();
    //   }
    //   console.log(user);
      mongoose.connection.close();
      process.exit()
    // });
  });
};

addRoles(role, id);
// console.log('done');