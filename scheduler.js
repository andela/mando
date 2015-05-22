'use strict';
var campaign_controller = require('./app/controllers/campaign.server.controller');
var mongoose = require('mongoose');
var scheduler = require('node-schedule');
var moment = require('moment');
var campaigns = mongoose.model('Campaign');
module.exports = function() {
  scheduler.scheduleJob({hour: 0, minute: 0}, function() {
    campaigns.find({status: 'active'}, function(err, campaigns) {
        campaigns.forEach(function(campaign) {
          var campaignDuedate = campaign.dueDate.getTime() + (5 * 60000);
          if (new Date().getTime() > new Date(campaignDuedate).getTime()) {
            campaign_controller.refundBackers(campaign, 'Cash refund from expired campaign', function(err, res) {
              campaign_controller.archiveCampaignAccount(campaign._id, function(error, result) {
                campaign.status = 'expired';
                campaign.save();
              });
            });
          }
        });
    });
  });
};
