'use strict';

//this file is to factor out test codes to avoid repetition,
//any code that would be repeat or used more than once should be written here
var elements = {
  signInButton: element(by.id('signIn')),
  signoutButton: element(by.id('signout'))
};
var helpers = {
  //loads the app at the given url
  loadApp: function(initialUrl) {
    initialUrl = initialUrl || '/';
    browser.get(initialUrl);
  },
  //login to the app
  login: function(email, password) {
    email = email || 'adebayo.maborukoje@andela.co';
    password = password || 'maborukoje2012'; //find a way to hide user credentials

    elements.signInButton.click();

    //remove this once signin page is removed in the app
    browser.driver.findElement(by.id('googleSignIn')).click();
    var emailInput = browser.driver.findElement(by.id('Email'));
    emailInput.sendKeys(email);
    var passwordInput = browser.driver.findElement(by.id('Passwd'));
    passwordInput.sendKeys(password);  //you should not commit this to VCS
    var googleSignIn = browser.driver.findElement(by.id('signIn'));
    googleSignIn.click();

    // we're about to authorize some permissions, but the button isn't enabled for a second
    browser.driver.sleep(2500);

    var submitApproveAccess = browser.driver.findElement(by.id('submit_approve_access'));
    submitApproveAccess.click();

    // this Allows Angular to Load
    browser.driver.sleep(5000);
  },
  logoutifLoggedIn: function() {
    elements.signoutButton.isDisplayed().then(function(isPresent) {
      if(isPresent) {
        elements.signoutButton.click();
      }
    });
  }
};

module.exports = helpers;