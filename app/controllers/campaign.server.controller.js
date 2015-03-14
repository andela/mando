/*campaign controller */
'use strict';

var mongoose = require('mongoose'),
    errorHandler =require('./errors.server.controller'),
    moment = require('moment'),
    User = mongoose.model('User'),
    subledger = require('./banker.server.controller'),
    Campaign = mongoose.model('Campaign');

/****Create A campaign *****/
exports.createCampaign= function(req, res){
  var campaign = new Campaign(req.body);
  campaign.createdBy = req.user._id;
  campaign.lastModifiedBy = req.user._id;
  if (!campaign.dueDate) {
    campaign.dueDate = moment().add(30, 'days');
  }
     // create subledger account for a campaign
     subledger.createAccount({
      'description': campaign.title + campaign._id,
      'reference': 'http://andela.co',
      'normal_balance': 'credit'
    }, function(err, account) {
      if (err) {
          // fail the transaction
          return res.json(err);
        } else {
          campaign.account_id = account.active_account.id;
          // continue with saving the user
          campaign.save(function(err, campaign){
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
          
        }
      });

};

exports.getCampaign = function(req, res){
  //the slug format is 080808/new-campaign, hence the addition in the find object
  Campaign.findOne({slug: req.params.timestamp + '/' + req.params.campaignslug})
    .select('-lastModifiedBy -lastModified')
    .exec(function(err, campaign){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      //if the user has no campaign created
      if (!campaign) {
        return res.status(400).send({
          message: 'Invalid campaignslug'
        });
      }
      Campaign.populate(campaign, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
        res.json(newCampaign);
      });
    });
};

exports.getUserCampaigns = function(req, res) {
  //validates the user id if valid or not
  User.findById(req.params.userId)
    .exec(function(err, user) {
      if(err) {
        return res.status(404).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      //if the user has no campaign created
      if (!user) {
        return res.status(404).send({
          message: 'Invalid User Id'
        });
      }
    });
  var ObjectId = mongoose.Types.ObjectId;
  Campaign.find({'createdBy': new ObjectId(req.params.userId)})
    .exec(function(err, campaign){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      Campaign.populate(campaign, {path:'createdBy lastModifiedBy'}, function(err, newCampaign) {
          res.json(newCampaign);
      });
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
      //if the user has no campaign created
      if (!editedCampaign) {
        return res.status(400).send({
          message: 'Invalid campaign id'
        });
      }
     Campaign.populate(editedCampaign, {path: 'createdBy lastModifiedBy'}, function (err, campaign){
      res.json(campaign);
     });
   });
  };


exports.deleteCampaign = function(req, res) {
  Campaign.findByIdAndRemove(req.params.campaignId)
  .exec(function(err, campaign) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.send('deleted successfully');
    }

    });
};

