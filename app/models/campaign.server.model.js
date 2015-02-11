'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/***** Campaign Schema ****/
var campaignSchema = new Schema({
  title: {
    type: String,
    required: 'Title cannot be empty',
    trim: true
  },

  description: {
    type: String,
    required: 'Describe the campaign',
    trim: true
  },

  amount: {
    type: Number,
    required: 'Enter the required amount needed'
  },

  fundraisingDeadline: {
    type: Date,
    default: Date.setMonth(2)
  },

  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
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
