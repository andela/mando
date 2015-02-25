'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');

describe('deleteCampaigns', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  it('should', function() {
    helper.logoutifLoggedIn();
    var signInButton = element(by.id('signIn'));
    signInButton.click();
    var myAndonation = element(by.id('myAndonation'));
    myAndonation.click();
    var titleButton = element.all(by.binding('campaign.title')).first();
    titleButton.click();
    var deleteButton = element(by.id('deleteButton'));
    deleteButton.click();
    var confirmDialog = browser.switchTo().alert();
    expect(confirmDialog.accept).toBeDefined();
    confirmDialog.accept();
    expect(element(by.tagName('table')).isPresent()).toBe(true);
  });
});
