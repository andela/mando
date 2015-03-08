'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    Role = mongoose.model('Role'),
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
  var _user = {};

  async.series([
    function(cb) {
      User.findById(userid)
        .exec(function(err, user) {
          if(err){
            done(err);
            return cb(err);
          }
          _user = user;
          cb(err);
        });
    },
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
        _user.roles.push(role._id);
        cb(err);
      });
    },
    function(cb) {
      //
      if(roleType === 'member') {
        _user.createdBy = userid;
        _user.created = Date.now();
      } else {
        _user.lastModifiedBy = adminid;
        _user.lastModified = Date.now();
      }
      _user.save(function(err, user) {
        if(err){
          done(err);
          return cb(err);
        }
        User.populate(user, {path: 'roles'}, function(err, populatedUser) {
          if(err){
            done(err);
            return cb(err);
          }
          done(err, populatedUser);
        });
      });
      cb();
    }
  ]);
};

//exports saveUserRole function
exports.addRolesToUser = saveUserRole;
//adds a role to a user
exports.addUserRoles = function(req, res) {
  saveUserRole(req.user._id, req.body.userid, req.body.role, function(err, data) {
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
