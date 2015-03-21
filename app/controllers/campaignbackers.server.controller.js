'use strict';

var mongoose = require('mongoose'),
    CampaignBacker = mongoose.model('CampaignBacker');

exports.createCampaignBacker = function(req, res) {
  var backer = new CampaignBacker(req.body);
  backer.userid = req.user._id;
  backer.createdBy = req.user._id;
  backer.save(function(err, newbacker) {
    if (err) {
      return res.json(err);
    }
    res.json(newbacker);
  });
};

exports.getCampaignBackers = function(req, res) {
  CampaignBacker.find({campaignid: req.params.campaignid}).populate('userid').exec(function(err, campaignBackers) {
    if (err) res.json(err);
    res.json(campaignBackers);
  });
};