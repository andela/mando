'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
  // User Routes
  var users = require('../../app/controllers/users.server.controller');

  //signout route
  app.route('/auth/signout').get(users.signout);

  // Setting the google oauth routes
  app.route('/auth/google').get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/auth/google/callback').get(users.oauthCallback('google'));

  if (process.env.NODE_ENV === 'test') {
    app.route('/auth/mock').post(function(req, res) {
      (passport.authenticate('mock', {
        user: req.body
      }, function(err, user, info) {
        if (err || !user) {
          return res.status(500).json({
            success: false
          });
        }

        res.json({
          success: true,
          user: user
        });
      }))(req, res);
    });

    app.route('/auth/mock/logout').get(function(req, res) {
      req.logout();
      res.json({
        success:true
      });
    });

    app.route('/auth/mock/callback').get(function(req, res) {
      passport.authenticate('mock', function(err, user, redirectURL) {
        if (err || !user) {
          return res.redirect('/');
        }

        req.login(user, function(err) {
          if (err) {
            return res.redirect('/');
          }

          return res.redirect(redirectURL || '/');
        });
      })(req, res);
    });
  }

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};