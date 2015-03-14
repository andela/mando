'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var errorHandler = require('../errors.server.controller');



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