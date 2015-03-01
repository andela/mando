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

//adds a role to a user
exports.addUserRoles = function(req, res) {
  var userRole = new UserRole(req.body);
  userRole.createdBy = req.user._id;
  userRole.lastModifiedBy = req.user._id;
  userRole.userId = req.body.user._id;

  async.series([
    function(cb) {
      Role.findOne({roleType: req.body.role}, function (err, role) {
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        if(!role) {
          return res.status(400).send({message: 'Invalid Role Type'});
        }
        userRole.roleId.push(role._id);
        cb(err);
      });
    },
    function(cb) {
      userRole.save(function(err, newUserRole) {
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        //updates the usel document with the new role added
        User.findByIdAndUpdate(req.body.user._id, {role: newUserRole._id}, {}, function(err, updatedUser) {
          //populates the role field in the user document
          User.populate(updatedUser, {path: 'role'}, function(err, populatedUser) {
            //updates the roleId field in the userRole document
            UserRole.populate(populatedUser.role, {path: 'roleId'}, function(err, populatedUserRole) {
            console.log(1, populatedUser);
            console.log(2, populatedUserRole);
            res.json(populatedUser);
            });
          });
        });
        cb();
      });
    }
  ]);
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
