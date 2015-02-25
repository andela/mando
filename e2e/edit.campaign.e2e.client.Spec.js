
'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');

describe('Add and view Campaign', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });

  //***********buttons************/
  var signInButton = element(by.id('signIn'));
  var myCampaign = element(by.id('myCampaign'));
  var myAndonation = element(by.id('myAndonation'));
  var campaignList = element.all(by.repeater('campaign in myCampaigns'));
  var title =element(by.model('campaign.title'));
  var description = element(by.model('campaign.description'));
  var editCampaignBtn = element(by.id('editCampaignBtn'));
  
  //******TEST**********//
  it('should show 4 campaigns from the existing campaign', function(){
//    helper.logoutIfLoggedIn();
     signInButton.click();
     browser.sleep(2000);
     myAndonation.click();
     expect(campaignList.count()).toBe(4);
  });

  it('should edit a campaign', function(){
    //helper.logoutIfLoggedIn();
   // helper.login();
    myAndonation.click();
    var campaignTitle = element.all(by.binding('campaign.title')).last();
    campaignTitle.click();
    browser.sleep(2000);
    expect(element(by.binding('campaign.title')).isPresent()).toBe(true);
    element(by.id('editBtn')).click();
     title.clear();
     title.sendKeys('A TEST APP');
    description.clear();
     description.sendKeys('LOREM IPSUM DOLOR SIT ELELE JHB S  SGS Skd welcome to the ne world i am typig ith my phone here but yocd descriptionu wiull be amased');
     editCampaignBtn.click();
     browser.sleep(2000);
    expect(element(by.binding('campaign.title')).getText()).toContain('A TEST APP');
  });
});