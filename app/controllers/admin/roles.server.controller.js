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
  Role.find({'roleType': {$ne: 'member'}}).select('roleType').exec(function(err, roles) {
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
  var usersid = req.body.usersid;
  var getRoles = function(role, done) {
    Role
      .findOne({roleType: role})
      .exec(function(err, nRole) {
        if (err) done(err);
        done(err, nRole._id);
      });
  };
  var updateRoles = function(isAdding, roles, userid, _callback) {
    async.eachSeries(roles, function(roleid, callback) {
      async.series([
        function(cb) {
          var query;
          if (isAdding) {
            query = {
              $addToSet: {roles: roleid},
              lastModifiedBy: req.user._id,
              lastModified: Date.now()
            };
          } else {
            query = {
              $pull: {roles: roleid},
              lastModifiedBy: req.user._id,
              lastModified: Date.now()
            };
          }
          User.where({_id: userid}).update(query, function(err, noOfUser, nUser) {
            callback(err);
            cb();
          });
        }
      ]);
    },
    function(err) {
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      _callback(err);
    });
  };
  async.eachSeries(usersid, function(userid, callb) {
    async.eachSeries(req.body.roles, function(roles, calbk) {
      var query = {};
      if(roles.addRoles) {
        updateRoles(true, roles.addRoles, userid, function() {
          calbk();
        });
      } else if (roles.rmRoles) {
        updateRoles(false, roles.rmRoles, userid, function() {
          calbk();
        });
      }
    }, function(err){
      callb();
    });
  }, function(err) {
    if(err) res.status(400).send('Error Occurred');
    User
      .find({})
      .populate('roles')
      .exec(function(err, users) {
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.json(users);
      });
  });
};
