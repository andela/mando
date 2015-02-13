'use strict';

var express = require('express'),
    router = express.Router(),
    campaigns = require('../../app/controllers/campaign.server.controller'),
    users = require('../../app/controllers/users.server.controller');

// router
// //.all('/campaign', users.requiresLogin)
// .post('/campaign/add', campaigns.createCampaign);
module.exports = function(app) {
  app.route('/campaign').all(users.requiresLogin);
  app.route('/campaign/add').post(campaigns.createCampaign);
  app.route('/campaign/:campaignId').get(campaigns.getCampaign);
};