'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var campaignBackerSchema = new Schema({
  campaignid: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled']
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