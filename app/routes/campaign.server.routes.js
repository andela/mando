'use strict';

var express = require('express'),
    router = express.Router(),
    campaigns = require('../../app/controllers/campaign.server.controller'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
  //added user.requresLogin for request that needs authentication 
  app.route('/campaign/add').post( users.requiresLogin, campaigns.createCampaign);
  app.route('/campaign/:timestamp/:campaignslug').get(campaigns.getCampaign);
  app.route('/campaign/:campaignId/edit').put(users.requiresLogin, campaigns.updateCampaign);
  app.route('/campaign/:timestamp/:campaignslug').delete(users.requiresLogin, campaigns.deleteCampaign);
  app.route('/campaigns').get(campaigns.getCampaigns); 
  app.route('/campaigns/:userId').get(users.requiresLogin, campaigns.getUserCampaigns);
};
