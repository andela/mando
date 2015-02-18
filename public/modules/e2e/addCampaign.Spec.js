
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


    it('should not accept Title with Less Than 5 Characters or', function(){
       // helper.logoutifLoggedIn();
       // helper.login();
       var title =element(by.model('campaign.title'));
       myCampaign.click();
       title.sendKeys('TEST');
       browser.sleep(2000);
       expect(element(by.id('lessThan5')).isDisplayed()).toBe(true);
       browser.driver.sleep(2000);
       title.clear();
       //sending an a string of empty characters
       title.sendKeys('         ');
       browser.driver.sleep(2000);
       expect(element(by.id('campaignIsRequired')).isDisplayed()).toBe(true); 
       //   expect(element(by.id('addCampaignBtn'))).toBeFalsy();
    });

    it('should not accept description with Less Than 20 Characters', function(){
       // helper.logoutifLoggedIn();
       // helper.login();
       myCampaign.click();
       var description =element(by.model('campaign.description'));
       description.sendKeys('These Characters');
       browser.driver.sleep(2000);
       expect(element(by.id('lessThan20')).isDisplayed()).toBe(true);
       browser.driver.sleep(2000);
       description.clear();
       browser.driver.sleep(2000);
       //sending an a string of empty characters
       description.sendKeys('                                   ');
       browser.driver.sleep(1000);
       expect(element(by.id('descriptionErr')).isDisplayed()).toBe(true);
      });

    it('should accept only numbers', function(){
        //TYPE NUMBER FIELD NOT CLEARING PROBLEM WITH PROTRACTOR https://github.com/angular/protractor/issues/1583
      myCampaign.click();
      var amount = element(by.model('campaign.amount'));
      amount.sendKeys('asdfghjkl');
      expect(element(by.id('isInvalidErr')).isDisplayed()).toBe(true);
    });
});