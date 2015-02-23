'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');

describe('userCampaigns', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });

  it('should load user campaign page', function() {
    helper.logoutifLoggedIn();
    var signInButton = element(by.id('signIn'));
    expect(signInButton.isDisplayed()).toBe(true, 'user logged out');
    signInButton.click();
    var myAndonation = element(by.id('myAndonation'));
    expect(myAndonation.isDisplayed()).toBe(true, 'authenticated user can view \'myAndonation\' page');
    myAndonation.click();
    expect(element(by.tagName('table')).isPresent()).toBe(true);
  });
});