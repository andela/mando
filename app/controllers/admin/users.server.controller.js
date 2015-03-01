'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    errorHandler = require('../errors.server.controller');

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
