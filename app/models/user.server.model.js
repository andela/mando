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
		required: 'Please fill in a username',
		trim: true
	},

	provider: {
		type: String,
		required: 'Provider is required'
	},

	providerData: {},
	additionalProvidersData: {},

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

	balance: {
		type: Number,
		default: 0
	},

	role: {
		type: [Schema.Types.ObjectId],
		ref: 'UserRole'
	}
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