'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),

  errorHandler = require('../errors.server.controller'),
  mongoose = require('mongoose'),
  async = require('async'),
  passport = require('passport'),
  adminRoles = require('../admin/roles.server.controller.js'),
  User = mongoose.model('User'),
  CampaignBacker = mongoose.model('CampaignBacker'),
  subledger = require('../banker.server.controller');

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, redirectURL) {
      if (err || !user) {
        return res.redirect('/');
      }
      req.login(user, function(err) {
        if (err) {
          return res.redirect('/');
        }

        return res.redirect(redirectURL || '/#!');
      });
    })(req, res, next);
  };
};

//gets backers for a single campaign
var getCampaignBackers = function (campaign, cb) {
  CampaignBacker.find({
    campaignid: campaign.campaignid._id
  }).distinct('userid').exec(function (err, backers) {
    campaign = campaign.toObject();
    campaign.backers = backers.length;
    cb(campaign);
  });
};

exports.campaignsUserBacks = function(req, res) {
  CampaignBacker.find({userid: req.user._id}).distinct('campaignid').exec(function(err, campaigns) {
    if (err) {
      errorHandler.getErrorMessage(err);
    }
    if (!campaigns) {
      res.json([]);
    }
    var allCampaigns = [];
    async.each(campaigns, function(campaign, cb) {
      CampaignBacker.findOne({campaignid: campaign}).populate('campaignid').exec(function(err, result) {
        getCampaignBackers(result, function(_campaign) {
          allCampaigns.push(_campaign);
          cb();
        });
      });
    }, function(err) {
      res.json(allCampaigns);
    });
  });
};
/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
  if (!providerUserProfile.email.match(/andela.com$/)) {
    // res.redirect('/');
    var newUser = req.user;
    return done(new Error('User is not from Andela.com'), newUser);
  }

  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function(err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
            user = {
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            };
            //updates the user object or create if not existing,
            //doing this because of the Admin user that would be manually created
            User.findOneAndUpdate({
              email: user.email
            }, user, {
              upsert: true
            }, function(err, user) {
              adminRoles.addRolesToUser(user._id, user._id, 'member', function(err, user) {
                subledger.createAccount({
                  'description': user.email,
                  'reference': 'http://andela.com',
                  'normal_balance': 'credit'
                }, function(err, account) {
                  if (err) {
                    return done(err, user);
                  } else {
                    user.account_id = account.active_account.id;
                    user.save(function(err, user) {
                      return done(err, user);
                    });
                  }
                });
              });
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) user.additionalProvidersData = {};
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function(err) {
        return done(err, user, '/#!/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};
