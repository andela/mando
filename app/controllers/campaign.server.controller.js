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
  console.log(4, req.user);
  if (!campaign.dueDate) {
    campaign.dueDate = moment().add(30, 'days');
  }
  campaign
    .save(function(err, campaign){
      console.log(5, campaign);
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

/******** LIST ALL CAMPAIGN **********/
// exports.getAllCampaign = function (req, res){
//   Campaign.find()
// }

