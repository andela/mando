'use strict';

var express = require('express'),
    router = express.Router(),
    campaigns = require('../../app/controllers/campaign.server.controller'),
    users = require('../../app/controllers/users.server.controller');


module.exports = function(app) {
  app.route('/campaign/*').all(users.requiresLogin);
  app.route('/campaigns/*').all(users.requiresLogin);
  app.route('/campaign/add').post(campaigns.createCampaign);
  app.route('/campaign/:campaignId').get(campaigns.getCampaign);
  app.route('/campaign/:campaignId/edit').put(campaigns.updateCampaign);
  app.route('/campaigns/:userId').get(campaigns.getCampaigns);
};