'use strict';

describe('Andonation Homepage', function() {
beforeEach(function() {
  browser.get('http://localhost:3000/');
  });

  it('should have a title', function() {
   expect(browser.getTitle()).toEqual('Andonation - Development Environment');
  });

  it('should display My andonation Upon Succefull login', function(){  
    element(by.id('signIn')).click();
   // browser.driver.sleep(1500);
    browser.driver.findElement(by.id('googleSignIn')).click();
   // browser.driver.sleep(2000);
    var emailInput = browser.driver.findElement(by.id('Email'));
    emailInput.sendKeys('adebayo.maborukoje@andela.co');

    var passwordInput = browser.driver.findElement(by.id('Passwd'));
    passwordInput.sendKeys('maborukoje2012');  //you should not commit this to VCS

    var signInButton = browser.driver.findElement(by.id('signIn'));
    signInButton.click();

    // we're about to authorize some permissions, but the button isn't enabled for a second
    browser.driver.sleep(1500);

    var submitApproveAccess = browser.driver.findElement(by.id('submit_approve_access'));
    submitApproveAccess.click();

    // this Allows Angular to Load
    browser.driver.sleep(10000);
    var myAndonation = browser.driver.findElement(by.id('myAndonation'));
    var myCampaign = browser.driver.findElement(by.id('myCampaign'));
     expect(myAndonation.getText()).toBeDefined();
     expect(myCampaign.getText()).toBeDefined();
  });
});

