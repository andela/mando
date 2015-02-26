/*campaign controller */
'use strict';

var mongoose = require('mongoose'),
    errorHandler =require('./errors.server.controller'),
    moment = require('moment'),
    Campaign= mongoose.model('Campaign');

/****Create A campaign *****/
exports.createCampaign= function(req, res){
  var campaign = new Campaign(req.body);
  campaign.createdBy = req.user._id;
  campaign.lastModifiedBy = req.user._id;
  if (!campaign.dueDate) {
    campaign.dueDate = moment().add(30, 'days');
  }
  campaign
    .save(function(err, campaign){
    if(err){
       return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //querying the database again because we want to populate the createdBy and lastModifiedBy field
      Campaign.populate(campaign, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
          res.json(newCampaign);
      });
    }
  });

};

exports.getCampaign = function(req, res){
  Campaign.findById(req.params.campaignId)
    .select('-lastModifiedBy -lastModified')
    .exec(function(err, campaign){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
         Campaign.populate(campaign, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
           res.json(newCampaign);
         });
      }
    });
};

exports.getUserCampaigns = function(req, res) {
  var ObjectId = mongoose.Types.ObjectId;
  Campaign.find({'createdBy': new ObjectId(req.params.userId)})
    .exec(function(err, campaign){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Campaign.populate(campaign, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
            res.json(newCampaign);
        });
      }
    });
};

exports.getCampaigns = function(req, res) {
  Campaign.find({}, function(err, campaigns) {
    if (err) {
      return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
      });
    }
    Campaign.populate(campaigns, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
      res.json(newCampaign);
    });
  });
};

exports.updateCampaign = function(req, res) {
  var campaign = req.body;
  campaign.lastModifiedBy = req.user._id;
  campaign.lastModified = moment().format();
  if (!campaign.dueDate) {
    campaign.dueDate = moment().add(30, 'days');
  }
  Campaign
    .findByIdAndUpdate(req.params.campaignId, campaign, {}, function(err, editedCampaign) {
      if(err){
          res.status(400).json(err);
      }
     Campaign.populate(editedCampaign, {path: 'createdBy lastModifiedBy'}, function (err, campaign){
      res.json(campaign);
     });
    });
};

