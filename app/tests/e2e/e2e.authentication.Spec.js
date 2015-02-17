'use strict';

var helper = require('./helpers');

describe('Andonation Authentication', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  var signInButton = element(by.id('signIn'));
  // var googleSignIn = element(by.id('googleSignIn'));
  



  it('should accept only emails with andela.co domain name', function() {
    
    helper.logoutifLoggedIn();
    //log in
    helper.login('mirabelkoso@gmail.com', 'divinemimi');


    var myAndonation = browser.driver.findElement(by.id('myAndonation'));
    expect(myAndonation.isDisplayed()).toBe(false);
    var myCampaign = browser.driver.findElement(by.id('myCampaign'));
    expect(myCampaign.isDisplayed()).toBe(false);
    expect(signInButton.isDisplayed()).toBe(true);
    helper.logoutifLoggedIn();
  });
});