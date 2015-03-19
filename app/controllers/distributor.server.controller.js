'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var errorHandler = require('./errors.server.controller');



exports.getUsers = function(req, res) {
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
};

exports.getUniqueUser = function(req, res) {
  var user_id = req.params.user_id;
  User
    .findById(user_id)
    .populate('roles')
    .exec(function (err, user) {
      if(err) {
        return errorHandler.sendError(res, err);
      }
      res.json(user);
    });
};


exports.getByUsername = function(req, res) {
  var username = req.params.username;
  User
    .find({username: username})
    .populate('roles')
    .exec(function (err, users) {
      if(err) {
        return errorHandler.sendError(res, err);
      }
      if(users.length !== 1) {
        return errorHandler.sendError(res, new Error('No user found!'));
      }
      res.json(users[0]);
    });
};