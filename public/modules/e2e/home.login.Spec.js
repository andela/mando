'use strict';
/* global describe */

describe('Andonation Homepage', function() {
  beforeEach(function() {
    browser.get('http://localhost:3000/');
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

  it('should display My andonation Upon Successful login', function(){
    signInButton.click();
    browser.driver.findElement(by.id('googleSignIn')).click();
    var emailInput = browser.driver.findElement(by.id('Email'));
    emailInput.sendKeys('adebayo.maborukoje@andela.co');
    var passwordInput = browser.driver.findElement(by.id('Passwd'));
    passwordInput.sendKeys('maborukoje2012');  //you should not commit this to VCS
    signInButton = browser.driver.findElement(by.id('signIn'));
    signInButton.click();

    // we're about to authorize some permissions, but the button isn't enabled for a second
    browser.driver.sleep(1500);

    var submitApproveAccess = browser.driver.findElement(by.id('submit_approve_access'));
    submitApproveAccess.click();

    // this Allows Angular to Load
    browser.driver.sleep(10000);
    var myAndonation = browser.driver.findElement(by.id('myAndonation'));
    expect(myAndonation.getText()).toBeDefined();
    var myCampaign = browser.driver.findElement(by.id('myCampaign'));
    expect(myCampaign.getText()).toBeDefined();
  });
});

