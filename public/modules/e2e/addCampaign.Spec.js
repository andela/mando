'use strict';

var helper = require('./helpers');

describe('Add and view Campaign', function() {
  beforeEach(function() {
    helper.loadApp('/');
     
  });
  //***********buttons************/
  var signInButton = element(by.id('signIn'));
  var myCampaign = element(by.id('myCampaign'));

  /****TESTS*********/
  it('should load the addCampaign page', function() {
    helper.logoutifLoggedIn();
    helper.login();
    //var myCampaign = browser.driver.findElement(by.id('myCampaign'));
    myCampaign.click();
    // console.log(element(by.id('title')));
     expect(element(by.id('title')).isDisplayed()).toBe(true);
  });

 //   iit('Should create A new Campaign', function() {
 //    helper.logoutifLoggedIn();
 //    helper.login();
 //    var myCampaign = browser.driver.findElement(by.id('myCampaign'));
 //    myCampaign.click();
 //     browser.driver.sleep(2500);
 //     browser.driver.findElement(by.id('title')).sendKeys('TESTING');
 //     browser.driver.findElement(by.id('amount')).sendKeys('20000');
 //     browser.driver.findElement(by.id('description')).sendKeys('A testing Server TO test');
 //    // browser.driver.findElement(by.css('[ng-click="open($event)"]')).click();
 //     browser.driver.findElement(by.id('youtubeUrl')).sendKeys('http://andela.co');
 //    // browser.driver.sleep(2000);
 //    // browser.driver.findElement(by.id('addCampaignButton')).click();
 // //  expect(element(by.id('title')).isDisplayed()).toBe(true);
 //  });

    iit('should not accept Title with Less Than 5 Characters', function(){
       helper.logoutifLoggedIn();
      helper.login();

     myCampaign.click();
     browser.driver.findElement(by.id('title')).sendKeys('TEST');
     browser.driver.sleep(2000);
     expect(element(by.id('lessThan5')).isDisplayed()).toBe(true);
     expect(element(by.id('addCampaignBtn'))).toBeFalsy();
    });

});