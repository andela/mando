'use strict';
//functions here used to create index data which would be needed
var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    Role = mongoose.model('Role'),
    User = mongoose.model('User'),
    errorHandler = require('../errors.server.controller');

exports.createRoles = function(req, res) {
  var role = new Role(req.body);
  role.save(function(err, role) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(role);
  });
};

//controller to manually add roles to admin,
//there is need to refactor this to add some level of authentication
//or find a better way to do this
exports.addRolesToAdmin = function(req, res) {
  var _user = {};

  async.series([
    function(cb) {
      User.findOne({email: req.body.email})
        .exec(function(err, user) {
          if(err){
            cb(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          _user = user;
          cb(err);
        });
    },
    function(cb) {
      Role.findOne({roleType: req.body.role}, function (err, role) {
        if(err){
          cb(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        if(!role){
          cb('Invalid Role Type');
          return res.status(400).send({
            message: 'Invalid Role Type'
          });
        }
        _user.roles.push(role._id);
        cb(err);
      });
    },
    function(cb) {
      _user.lastModifiedBy = _user._id;
      //Date.now wasn't working for lastModified for some reasons I don't know
      //so had to use moment
      _user.lastModified = moment().format();
      _user.save(function(err, user) {
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        User.populate(user, {path: 'roles'}, function(err, populatedUser) {
          if(err){
            cb(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          res.json(populatedUser);
        });
      });
      cb();
    }
  ]);
};

