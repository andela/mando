'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['lodash',
	function(lodash) {
		var _this = this;
    var user = window.user;

		_this._data = {
			user: user,
      requireLogin: function($state, stateName) {
        if (!user) {
          $state.go(stateName || 'home');
        }
      },

      hasRole: function(role) {
        return lodash.findWhere(user.roles, {'roleType': role}) ? true : false;
      },
      requireRole: function($state, role, stateName) {
        //redirects user to myAndonation is user is logged in and not an admin
        if (!lodash.findWhere(user.roles, {'roleType': role})) {
          $state.go(stateName);
        }
      }
		};

		return _this._data;
	}
]);