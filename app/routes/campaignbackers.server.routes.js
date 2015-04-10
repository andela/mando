'use strict';

var campaignBackers = require('../controllers/campaignbackers.server.controller');

module.exports = function(app) {
  app.route('/campaign/backer/new').post(campaignBackers.createCampaignBacker);
  app.route('/campaigns/:campaignid/backers').get(campaignBackers.getCampaignBackers);
};