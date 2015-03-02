'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');

describe('deleteCampaigns', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  it('should delete a campaign when a user confirms ok', function() {
    helper.logoutifLoggedIn();
    var signInButton = element(by.id('signIn'));
    signInButton.click();
    var myAndonation = element(by.id('myAndonation'));
    myAndonation.click();
    var titleButton = element.all(by.binding('campaign.title')).first().click();
    var titleUrl = titleButton.getAttribute('href');
    element(by.id('editBtn')).click();
    var deleteButton = element(by.id('deleteCampaignBtn'));
    deleteButton.click();
    var confirmDialog = browser.switchTo().alert();
    expect(confirmDialog.accept).toBeDefined();
    confirmDialog.accept();
    expect(element(by.tagName('table')).isPresent()).toBe(true);
    expect(element.all(by.binding('campaign.title')).first().getAttribute('href')).not.toBe(titleUrl);
    });

    it('should not delete a campaign when a user clicks cancel', function() {
    browser.sleep(1000);
    var myAndonation = element(by.id('myAndonation'));
    myAndonation.click();
    var titleButton2 = element.all(by.binding('campaign.title')).first();
    titleButton2.click();
    element(by.id('editBtn')).click();
    element(by.id('deleteCampaignBtn')).click();
    var confirmDialog = browser.switchTo().alert();
    expect(confirmDialog.dismiss).toBeDefined();
    confirmDialog.dismiss();
    expect(element(by.id('deleteCampaignBtn')).isPresent()).toBe(true);
    helper.logoutifLoggedIn();
    });
});
