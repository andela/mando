'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');

describe('userCampaigns', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  var myAndonation = element(by.id('myAndonation'));

  it('should load user campaign page', function() {
    helper.logoutifLoggedIn();
    var signInButton = element(by.id('signIn'));
    expect(signInButton.isDisplayed()).toBe(true, 'user logged out');
    signInButton.click();
    //var myAndonation = element(by.id('myAndonation'));
    expect(myAndonation.isDisplayed()).toBe(true, 'authenticated user can view \'myAndonation\' page');
    myAndonation.click();
    expect(element(by.tagName('table')).isPresent()).toBe(true);
  });

  it('should redirect user to home page if invalid user id is entered', function() {
    myAndonation.click();
    expect(browser.getCurrentUrl()).toMatch(/myAndonation$/);
    browser.get('http://localhost:3000/#!/campaigns/54f39eb02e5e56fc7690e2sd');
    expect(browser.getCurrentUrl()).not.toMatch(/myAndonation/);
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
  });
});