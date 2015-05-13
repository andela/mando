'use strict';

var mongoose = require('mongoose');
var Campaign = mongoose.model('Campaign');
var should = require('should');
console.log('ok');
var mockCampaign = {
  title: 'A new Campaign',
  description: 'creating a new campaign for test',
  amount: 200,
  youtubeUrl: 'youtubeUrl',
};
describe('Campaigns', function () {
  beforeEach(function (done) {
    Campaign.remove({}, function () {
      done();
    });
  });
  afterEach(function (done) {
    Campaign.remove({}, function () {
      done();
    });
  });
  it('should be able to create campaign', function (done) {
    Campaign.create(mockCampaign, function(err, campaign) {
      should.not.exist(err);
      campaign.title.should.equal(mockCampaign.title);
      done();
    });
  });

  it('should not create Campaigns for a title less than 5 characters', function (done) {
    mockCampaign.title = 'a';
    Campaign.create(mockCampaign, function(err, campaign) {
      should.exist(err);
      should.not.exist(campaign, 'Campaign was not created because title is less than 5 characters');
      done();
    });
  });
});