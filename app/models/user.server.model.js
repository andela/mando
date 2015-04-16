'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: ''
	},
	lastName: {
		type: String,
		trim: true,
		default: ''
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		trim: true
	},

	provider: {
		type: String,
	},

	providerData: {},

	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},

	lastModified: {
		type: Date,
		default: Date.now
	},

	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	lastModifiedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	account_id: {
		type: String
	},
	roles: [{
		type: Schema.Types.ObjectId,
		ref: 'Role'
	}]
});

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};
mongoose.model('User', UserSchema);