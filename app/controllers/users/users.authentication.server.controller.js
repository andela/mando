'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),

	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	adminRoles = require('../admin/roles.server.controller.js'),
	User = mongoose.model('User');
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

        return res.redirect(redirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {


// 	if(!providerUserProfile.email.match(/andela.co$/)) {
		
// 			// res.redirect('/');
// 		var newUser = req.user;
//   	return done(new Error('User is not from Andela.co'), newUser);
// 	}

// 	if (!req.user) {
// 		// Define a search query fields
// 		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
// 		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

// 		// Define main provider search query
// 		var mainProviderSearchQuery = {};
// 		mainProviderSearchQuery.provider = providerUserProfile.provider;
// 		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

// 		// Define additional provider search query
// 		var additionalProviderSearchQuery = {};
// 		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

// 		// Define a search query to find existing user with current provider profile
// 		var searchQuery = {
// 			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
// 		};

// 		User.findOne(searchQuery, function(err, user) {
// 			if (err) {
// 				return done(err);
// 			} else {
// 				if (!user) {
// 					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

// 					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
// 						user = {
// 							firstName: providerUserProfile.firstName,
// 							lastName: providerUserProfile.lastName,
// 							username: availableUsername,
// 							displayName: providerUserProfile.displayName,
// 							email: providerUserProfile.email,
// 							provider: providerUserProfile.provider,
// 							providerData: providerUserProfile.providerData
// 						};
// 						//updates the user object or create in not existing,
// 						//doing this because of the Admin user that would be manually created
// 						User.findOneAndUpdate({email: user.email}, user, {upsert: true}, function(err, user) {
// 							adminRoles.addRolesToUser(user._id, user._id, 'member', function(err, user) {
// 								return done(err, user);
// 							});
// 						});
// 					});
// 				} else {
// 					return done(err, user);
// 				}
// 			}
// 		});
// 	} else {
// 		// User is already logged in, join the provider data to the existing user
// 		var user = req.user;

// 		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
// 		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
// 			// Add the provider data to the additional provider data field
// 			if (!user.additionalProvidersData) user.additionalProvidersData = {};
// 			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

// 			// Then tell mongoose that we've updated the additionalProvidersData field
// 			user.markModified('additionalProvidersData');

// 			// And save the user
// 			user.save(function(err) {
// 				return done(err, user, '/#!/settings/accounts');
// 			});
// 		} else {
// 			return done(new Error('User is already connected using this provider'), user);
// 		}
// 	}
// =======
  if(!providerUserProfile.email.match(/andela.co$/)) {
    
      // res.redirect('/');
    var newUser = req.user;
    return done(new Error('User is not from Andela.co'), newUser);
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
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // create subledger account
            subledger.createAccount({
              'description': user.email,
              'reference': 'http://andela.co',
              'normal_balance': 'debit'
            }, function(err, account) {
              if (err) {
                // fail the transaction
                return done(err, user);
              } else {
                user.account_id = account.active_account.id;
                // continue with saving the user
                user.save(function(err) {   
                 return  done(err, user);
                });
              }
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