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