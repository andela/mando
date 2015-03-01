'use strict';

var mongoose = require('mongoose'),
    Role = mongoose.model('Role'),
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

//finds a user role id since the role is already defined
var getRoleId = function(role) {
  Role.findOne({role: role}, function (err, role) {
    return role._id;
  });
};

//adds a role to a user
exports.addUserRoles = function(req, res) {
  var userRole = new UserRole(req.body);
  userRole.createdBy = req.user._id;
  userRole.lastModifiedBy = req.user._id;
  userRole.roleId.push(getRoleId(req.body.role));
  userRole.userId = req.body.user._id;
  userRole.save(function(err, newUserRole) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(newUserRole);
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
