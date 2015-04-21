/*campaign controller */
'use strict';
var mongoose = require('mongoose'),
  async = require('async'),
  errorHandler = require('./errors.server.controller'),
  moment = require('moment'),
  User = mongoose.model('User'),
  subledger = require('./banker.server.controller'),
  Campaign = mongoose.model('Campaign'),
  CampaignBacker = mongoose.model('CampaignBacker');
/****Create A campaign *****/
exports.createCampaign = function (req, res) {
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
  }, function (err, account) {
    if (err) {
      // fail the transaction
      return res.json(err);
    } else {
      campaign.account_id = account.active_account.id;
      // continue with saving the user
      campaign.save(function (err, campaign) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          //querying the database again because we want to populate the createdBy and lastModifiedBy field
          Campaign.populate(campaign, {
            path: 'createdBy lastModifiedBy'
          }, function (err, newCampaign) {
            res.json(newCampaign);
          });
        }
      });
    }
  });
};

//gets backers for a single campaign
var getCampaignBackers = function (campaign, cb) {
  CampaignBacker.find({
    campaignid: campaign._id
  }).distinct('userid').exec(function (err, backers) {
    campaign = campaign.toObject();
    campaign.backers = backers.length;
    cb(campaign);
  });
};

//get backers for array of campaigns
var _getCampaignsBackers = function (newCampaigns, callback) {
  var campaigns = [];
  async.each(newCampaigns, function (campaign, cb) {
    var CampaignBacker = mongoose.model('CampaignBacker');
    CampaignBacker.find({
      campaignid: campaign._id
    }).distinct('userid').exec(function (err, backers) {
      campaign = campaign.toObject();
      campaign.backers = backers.length;
      campaigns.push(campaign);
      cb();
    });
  }, function (err) {
    callback(campaigns);
  });
};

exports.getCampaign = function (req, res) {
  //the slug format is 080808/new-campaign, hence the addition in the find object
  Campaign.findOne({
      slug: req.params.timestamp + '/' + req.params.campaignslug
    })
    .select('-lastModifiedBy -lastModified')
    .exec(function (err, campaign) {
      if (err) {
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
      Campaign.populate(campaign, {
        path: 'createdBy lastModifiedBy'
      }, function (err, newCampaign) {
        getCampaignBackers(newCampaign, function (campaign) {
          res.json(campaign);
        });
      });
    });
};
exports.getUserCampaigns = function (req, res) {
  //validates the user id if valid or not
  User.findById(req.params.userId)
    .exec(function (err, user) {
      if (err) {
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
  Campaign.find({
      'createdBy': new ObjectId(req.params.userId),
      status: { $ne: 'deleted'}
    })
    .exec(function (err, campaigns) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      Campaign.populate(campaigns, {
        path: 'createdBy lastModifiedBy'
      }, function (err, newCampaigns) {
        _getCampaignsBackers(newCampaigns, function (userCampaigns) {
          res.json(userCampaigns);
        });
      });
    });
};

exports.getCampaigns = function (req, res) {
  Campaign.find({status: 'active'}, function (err, campaigns) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    Campaign.populate(campaigns, {
      path: 'createdBy lastModifiedBy'
    }, function (err, newCampaigns) {
      _getCampaignsBackers(newCampaigns, function (allCampaigns) {
        res.json(allCampaigns);
      });
    });
  });
};
exports.updateCampaign = function (req, res) {
  var campaign = req.body;
  campaign.lastModifiedBy = req.user._id;
  campaign.lastModified = moment().format();
  if (!campaign.dueDate) {
    campaign.dueDate = moment().add(30, 'days');
  }
  Campaign
    .findByIdAndUpdate(req.params.campaignId, {
      $set: campaign
    }, {}, function (err, editedCampaign) {
      if (err) {
        res.status(400).json(err);
      }
      //if the user has no campaign created
      if (!editedCampaign) {
        return res.status(400).send({
          message: 'Invalid campaign id'
        });
      }
      Campaign.populate(editedCampaign, {
        path: 'createdBy lastModifiedBy'
      }, function (err, campaign) {
        res.json(campaign);
      });
    });
};
exports.archiveCampaignAccount = function(campaignAccountId, cb) {
  subledger.archiveCampaignAccount(campaignAccountId, function(error, response) {
  cb(error, response);
  });
};

exports.refundBackers = function(campaign, description, callback) {
  CampaignBacker.find({campaignid: campaign._id, status: 'active'}).populate('userid').exec(function(err, results) {
    if (!results) {
      return callback(err, results);
    }
    async.each(results, function(backer, cb) {
      backer.status = 'cancelled';
      backer.save();
      subledger.creditUserAccount('credit', backer.amountDonated, campaign.account_id, backer.userid.account_id, campaign.title, description, function(error, response) {
        cb(error);
      });
    }, function(err) {
      callback(err, results);
    });
  });
};

exports.deleteCampaign = function (req, res) {
  var description = 'Cash Refund from deleted campaign';
  var data = {};
  data.lastModifiedBy = req.user._id;
  data.lastModified = moment().format();
  data.status = 'deleted';
  Campaign.findByIdAndUpdate(req.params.campaignId, { $set: data }, {}, function (err, campaign) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      exports.refundBackers(campaign, description, function(err, results) {
        exports.archiveCampaignAccount(campaign.account_id, function(err, response) {
          if (err) {
            res.status(500).json({message: 'Cannot archive the campaign account'});
          }
          res.send('deleted successfully');
        });
      });
    }
  });
};

exports.fundCampaign = function(req, res) {
  Campaign.update({_id: req.params.campaignId}, {$inc: {raisedFunds: req.body.amount}}, function(err, res) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      Campaign.find({status: 'active'}, function(err, campaigns) {
        campaigns.forEach(function(campaign) {
          if (campaign.raisedFunds === campaign.amount) {
            campaign.status = 'funded';
            campaign.dateFunded = Date.now();
            campaign.save();
            return;
          }
        });
      });
    }
  });
};
