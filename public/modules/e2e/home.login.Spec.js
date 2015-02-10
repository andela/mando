'use strict';
/* global describe */
var helper = require('./helpers');
describe('Andonation Homepage', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  var signInButton = element(by.id('signIn'));

  it('should have a title', function() {
   expect(browser.getTitle()).toEqual('Andonation');
  });

  it('should show the signin button to unathenticated users', function() {
    expect(signInButton.isDisplayed()).toBe(true);
  });

  it('should not show myAndonation button to unauthenticated users', function() {
    expect(element(by.id('myCampaign')).isDisplayed()).toBe(false);
    expect(element(by.id('myAndonation')).isDisplayed()).toBe(false);
  });

  it('should display \'My Andonation\' Upon Successful login', function(){
    //logout any user if logged in
    helper.logoutifLoggedIn();
    //log in
    helper.login();

    var myAndonation = browser.driver.findElement(by.id('myAndonation'));
    expect(myAndonation.getText()).toBeDefined();
    
    var myCampaign = browser.driver.findElement(by.id('myCampaign'));
    expect(myCampaign.getText()).toBeDefined();
    expect(signInButton.isDisplayed()).toBe(false);
    helper.logoutifLoggedIn();
  });
  it('should show the signin button after logging out', function() {
    expect(signInButton.isDisplayed()).toBe(true);
  });
  
  // it('should login with another credentials', function(){
  //   helper.logoutifLoggedIn();
  //   helper.login('mirabel.ekwenuogo@andela.co', 'divinemimi');
  //   var myAndonation = browser.driver.findElement(by.id('myAndonation'));
  //   expect(myAndonation.getText()).toBeDefined();
    
  //   var myCampaign = browser.driver.findElement(by.id('myCampaign'));
  //   expect(myCampaign.getText()).toBeDefined();
  //   expect(signInButton.isDisplayed()).toBe(false);
  //   helper.logoutifLoggedIn();

  // });

});

