/*campaign controller */
'use strict';

var mongoose = require('mongoose'),
    errorHandler =require('./errors.server.controller'),
    moment = require('moment'),
    Campaign= mongoose.model('Campaign');
//    _ = require('lodash');


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
          .exec(function(err, campaign){
              if(err){
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // res.json(campaign);
                Campaign.populate(campaign, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
                    res.json(newCampaign);
                  });
              }
          });
};

exports.getCampaigns = function(req, res) {
  var ObjectId = mongoose.Types.ObjectId;
  Campaign.find({'createdBy': new ObjectId(req.params.userId)})
    .exec(function(err, campaign){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // res.json(user);
        Campaign.populate(campaign, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
            res.json(newCampaign);
        });
      }
    });
};

exports.updateCampaign = function(req, res) {
  var campaign = req.body;
  campaign.lastModifiedBy = req.user._id;
  campaign.lastModified = moment().format();
  console.log(campaign);
  Campaign
    .findByIdAndUpdate(req.params.campaignId, campaign, {}, function(err, editedCampaign) {
      if(err){
        res.status(400).json(err);
      }
      console.log(editedCampaign);
      res.json(editedCampaign);
    });
};

