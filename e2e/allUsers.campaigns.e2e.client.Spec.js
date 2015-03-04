'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');

describe('allUsersCampaigns', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });

  it('should load the campaign page for all users', function() {
    helper.logoutifLoggedIn();
    var seeMoreCampaigns = element(by.id('all-campaigns'));
    expect(seeMoreCampaigns.isDisplayed()).toBe(true);
    seeMoreCampaigns.click();
    expect(element(by.tagName('ul')).isPresent()).toBe(true);
    expect(element(by.binding('campaign.title')).isDisplayed()).toBe(true);
  });
});