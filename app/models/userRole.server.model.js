'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userRoleSchema = new  Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
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
  }
});

mongoose.model('UserRole', userRoleSchema);