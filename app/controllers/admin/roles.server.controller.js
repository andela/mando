'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    Role = mongoose.model('Role'),
    User = mongoose.model('User'),
    UserRole = mongoose.model('UserRole'),
    User = mongoose.model('User'),
    errorHandler = require('../errors.server.controller');

exports.addRoles = function(req, res) {
  var role = new Role(req.body);
  role.createdBy = req.user._id;
  role.lastModifiedBy = req.user._id;
  role.save(function(err, role) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(role);
  });
};

exports.getRoles = function(req, res) {
  Role.find({}, function(err, roles) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(roles);
  });
};


var saveUserRole = function(adminid, userid, roleType, done) {
  var userRole = new UserRole({});
  userRole.createdBy = adminid;
  userRole.lastModifiedBy = adminid;
  userRole.userId = userid;

  async.series([
    function(cb) {
      Role.findOne({roleType: roleType}, function (err, role) {
        if(err){
          done(err);
          return cb(err);
        }
        if(!role) {
          var errMsg = {message: 'Invalid Role Type'};
          done(errMsg);
          return cb(errMsg);
        }
        userRole.roleId.push(role._id);
        cb(err);
      });
    },
    function(cb) {
      userRole.save(function(err, newUserRole) {
        if(err){
          done(err);
          return cb(err);
        }
        //updates the user document with the new role added
        User.findByIdAndUpdate(userid, {'roles': newUserRole._id}, {}, function(err, updatedUser) {
          if(err){
            done(err);
            return cb(err);
          }
          //populates the role field in the user document
          User.populate(updatedUser, {path: 'roles'}, function(err, populatedUser) {
            //updates the roleId field in the userRole document
            UserRole.populate(populatedUser.roles, {path: 'roleId'}, function(err, populatedUserRole) {
              done(err, populatedUserRole);
            });
          });
        });
        cb();
      });
    }
  ]);
};

//exports saveUserRole function
exports.addRolesToUser = saveUserRole;
//adds a role to a user
exports.addUserRoles = function(req, res) {
  saveUserRole(req.user._id, req.body.user._id, req.body.role, function(err, data) {
    if(err){
      return res.status(400).json(err);
    }
    res.json(data);
  });
};

//get all users as an admin
exports.getUsers = function(req, res) {
  User.find({}, function(err, users) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  });
};
