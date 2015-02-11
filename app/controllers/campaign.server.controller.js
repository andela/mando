/*campaign controller */
'use strict';

var mongoose = require('mongoose'),
    errorHandler =require('./errors.server.controller'),
    Campaign= mongoose.model('Campaign');


/****Create A campaign *****/
exports.createCampaign= function(req, res){
  var campaign = new Campaign(req.body);
//  campaign.user = req.user;
  campaign.save(function(err){
    if(err){
       return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign);
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
                res.json(campaign);
              }
          });
};

/******** LIST ALL CAMPAIGN **********/
// exports.getAllCampaign = function (req, res){
//   Campaign.find()
// }

