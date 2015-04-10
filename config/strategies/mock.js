'use strict';

var passport = require('passport'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  util = require('util');

function MockStrategy(options, verify) {
  this.name = 'mock';
  this.passAuthentication = options.passAuthentication || true;
  this._verify = verify;
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function authenticate(req, options) {
  var self = this;
  options = options || {};

  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    req.login(user, function(err) {
      if (err) {
        return self.error(err);
      }

      return self.success(user, info);
    });
  }

  if (options.user) {
    this.user = new User(options.user);
    this.user.save(function(err, user) {
      if (err) {
        return self.error(err);
      }

      try {
        if (self._passReqToCallback) {
          self._verify(req, self.user, verified);
        } else {
          self._verify(self.user, verified);
        }
      } catch (e) {
        return self.error(e);
      }
    });
  }
};

module.exports = function() {
  // create your verify function on your own -- should do similar things to the "real" one.
  passport.use(new MockStrategy({
    callbackURL: '/auth/mock/callback',
    passReqToCallback: true
  }, function(user, cb) {
    cb(null, user);
  }));
};
