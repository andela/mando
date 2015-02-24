
'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');
var moment = require('moment');

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
  });

  it('should not accept description with Less Than 20 Characters', function(){
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

  it('should validate wrong youtube url', function() {
    myCampaign.click();
    var submit = element(by.id('addCampaignBtn'));
    var youtubeUrl = element(by.model('campaign.youtubeUrl'));
    //send wrong url format
    youtubeUrl.sendKeys('wrong url format');
    expect(submit.isEnabled()).toBe(false);
    expect(youtubeUrl.getAttribute('class')).toContain('ng-invalid-url');
    expect(element(by.id('invalid-url')).isDisplayed()).toBe(true);
    youtubeUrl.clear();
    browser.refresh();

    //test with another url format that is not correct
    youtubeUrl.sendKeys('www.youtube.com');
    expect(submit.isEnabled()).toBe(false);
    expect(youtubeUrl.getAttribute('class')).toContain('ng-invalid-url');
    expect(element(by.id('invalid-url')).isDisplayed()).toBe(true);
    youtubeUrl.clear();
    browser.refresh();
    expect(youtubeUrl.getAttribute('class')).toContain('ng-pristine');

    //test for wrong youtube video ids
    youtubeUrl.sendKeys('https://www.youtube.com/watch?v=mq59iE3');
    expect(element(by.binding('youtubeError')).isDisplayed()).toBe(true);
    youtubeUrl.clear();
    browser.refresh();

    //test for invalid youtube video ids via youtube api
    youtubeUrl.sendKeys('https://www.youtube.com/watch?v=mq59iE4MhaM');
    expect(element(by.binding('youtubeError')).isDisplayed()).toBe(true);
    youtubeUrl.clear();
    browser.refresh();
    youtubeUrl.sendKeys('https://www.youtube.com/watch?v=mq59iE3MhXM');
    expect(element(by.binding('youtubeError')).isDisplayed()).toBe(false);
    expect(youtubeUrl.getAttribute('class')).toContain('ng-valid');
    expect(youtubeUrl.getAttribute('class')).toContain('ng-valid-url');
  });
  it('should disabled date field on page load', function() {
    myCampaign.click();
    var dueDate = element(by.model('campaign.dueDate'));
    expect(dueDate.isEnabled()).toBe(false);
  });

  it('should be able to pick date via the datepicker', function() {
    myCampaign.click();
    var datepicker = element(by.css('.calendar'));
    expect(datepicker.isDisplayed()).toBe(true);
    expect(element(by.css('ul.dropdown-menu')).isDisplayed()).toBe(false);
    datepicker.click();
    expect(element(by.css('ul.dropdown-menu')).isDisplayed()).toBe(true);
  });

  it('should not allow user pick date above or below the limit', function() {
    myCampaign.click();
    var minDate = moment().add(1, 'days');
    var week = moment().week();
    var datepicker = element(by.css('span.col-sm-1.calendar'));
    element.all(by.repeater('row in rows'));
    expect(datepicker.isDisplayed()).toBe(true);
    datepicker.click();
    var tbody = element(by.css('tbody'));

  });
week.filter(function(elem, index) {
 return elem.getText().then(function(text) {
   return text === '6';
  });
  }).then(function(fil) {
    console.log(1, fil)
    console.log(2, fil[0])
    fil[0].getText()
    })

element.all(by.repeater('row in rows')).all(by.binding(' weekNumbers[$index] '))
































});