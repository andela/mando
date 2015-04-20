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

  raisedFunds: {
    type: Number,
    default: 0
  },

  youtubeUrl: {
    type: String,
    required: 'Enter your youtube campaign video url'
  },

  dueDate: {
    type: Date
  },
  slug: {
    type: String,
  },

  status: {
    type: String,
    enum: ['active', 'funded', 'expired', 'deleted'],
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
  },
  account_id: {
    type: String
  }
});

//function to slugify the title
//copied from http://blog.benmcmahen.com/post/41122888102/creating-slugs-for-your-blog-using-express-js-and
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

// Generate the slug
campaignSchema.pre('save', function (next) {
  this.slug = slugify(this.title);
  var timestamp = moment(this.created).format('hhmmss');
  this.slug = timestamp + '/' + this.slug;
  next();
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