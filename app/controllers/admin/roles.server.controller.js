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

//adds default role of member to user
exports.addRolesToUser = function(adminid, userid, roleType, done) {
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
      _user.createdBy = userid;
      _user.created = Date.now();
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

//updates user roles
exports.updateUserRole = function(req, res) {
  var roles = req.body.roles, _roles = [];
  roles.push('member');
  var usersid = req.body.usersid;
  var allUsers = [];
  async.eachSeries(usersid, function(userid, callb) {
    async.series([
      function(cb) {
        async.eachSeries(roles, function(role, callback) {
          Role
            .findOne({roleType: role})
            .exec(function(err, nRole) {
              if (err) callback(err);
              _roles.push(nRole._id);
              callback();
            });
        },
        function(err) {
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          cb();
        });
      },
      function(cb) {
        var oneUser = {};
        oneUser.roles = _roles;
        oneUser.lastModified = Date.now();
        oneUser.lastModifiedBy = req.user._id;
        User.findByIdAndUpdate(userid, oneUser, function(err, nUser) {
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          User.populate(nUser, {path: 'roles'}, function(err, populatedUser) {
            if(err){
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            allUsers.push(populatedUser);
            console.log(-1, allUsers);
            callb();
          });
        });
      }]);
  }, function(err) {
    console.log(-1, allUsers);
    res.json(allUsers);
  });
};




