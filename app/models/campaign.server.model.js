'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
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
    default: '',
    trim: true
  },

  amount: {
    type: Number,
    required: 'Enter the required amount needed'
  },

  youtubeUrl: {
    type: String,
    required: 'Enter your youtube campaign video url'
  },

  dueDate: {
    type: Date
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

campaignSchema.path('title').validate(function(v) {
 return v.length > 5;
},'Title Cannot Be Less Than 5 Characters');

campaignSchema.path('description').validate(function(v) {
 return v.length > 20;
},'Description Cannot Be Less Than 20 Characters');

campaignSchema.path('dueDate').validate(function(date) {
  return moment(date).unix() < moment().add(30, 'days').unix() + 5;
}, 'Deadline cannot be greater than 30 days');

mongoose.model('Campaign', campaignSchema);