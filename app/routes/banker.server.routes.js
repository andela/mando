'use strict';
var banker = require('../controllers/banker.server.controller');

module.exports = function(app){
  app.route('/identity').get(banker.getIdentity);
};