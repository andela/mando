'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var roleSchema = new Schema({
  roleType: {
    type: String,
    enum: ['member', 'admin', 'banker']
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