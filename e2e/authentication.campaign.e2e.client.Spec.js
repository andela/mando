'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');

describe('Andonation Authentication', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  var signInButton = element(by.id('signIn'));
  // var googleSignIn = element(by.id('googleSignIn'));
  it('should accept only emails with andela.co domain name', function() {
    browser.driver.manage().deleteAllCookies();
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
  // it('should not show the user campaigns table', function() {
  //     browser.sleep(2000);
  //     var login = function(email, password) {
  //   email = 'mirabel.ekwenugo@andela.co';
  //   password = 'divinemimi'; //find a way to hide user credentials
  //   var signInButton =  element(by.id('signIn'));
  //   signInButton.click();

  //   var emailInput = browser.driver.findElement(by.id('Email'));
  //   emailInput.sendKeys(email);
  //   var passwordInput = browser.driver.findElement(by.id('Passwd'));
  //   passwordInput.sendKeys(password);  //you should not commit this to VCS
  //   var googleSignIn = browser.driver.findElement(by.id('signIn'));
  //   googleSignIn.click();

  //   // we're about to authorize some permissions, but the button isn't enabled for a second
  //   browser.driver.sleep(2500);

  //   var submitApproveAccess = browser.driver.findElement(by.id('submit_approve_access'));
  //   submitApproveAccess.click();

  //   // this Allows Angular to Load
  //   browser.driver.sleep(5000);
  //     var myAndonation = browser.driver.findElement(by.id('myAndonation'));
  //     myAndonation.click();
  //     expect(element(element(by.tagName('table')).isPresent)).toBe(false);
  //   };
    // });
});