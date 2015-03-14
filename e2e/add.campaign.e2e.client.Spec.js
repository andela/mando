'use strict';

var helper = require('./helpers.authentication.e2e.client.Spec');
var moment = require('moment');
//clickDate clicks a date on the ui-bootstrap datePicker
/* Due to the complexity of the datepicker, I had to do this tedious steps to
    be able to click dates in the datepicker
    -1 finds rows by protractor repeater, which will return all rows
    -2 find the row where the first character is the present weekNo in the year
        with protractor filter
    -3 find all table cells(td) in the row, which will includes the week no
    -4 find the cell that contains the day of the month and click
*/
var clickDate = function(weekNo, todayNo, next) {
  //converts to string, for it to have .length prototype
  todayNo = todayNo.toString();
  //date picker adds preceeding 0 to their days, and moment doesn't return such
  //so added tenary operator to add it .length is 1
  todayNo = todayNo.length === 1 ? '0' + todayNo : todayNo;
  var datepicker = element(by.css('.calendar'));
  datepicker.click();
  var re = new RegExp('^' + weekNo);
  //to check for above limit, there would be need to go the next month
  if (next) {
    element(by.css('.glyphicon.glyphicon-chevron-right')).click();
  }
  var weeks = element.all(by.repeater('row in rows'));
  var currentWeek = weeks.filter(function(week, index) {
    return week.getText().then(function(text) {
      return Boolean(text.match(re)) === true;
    });
  });
  var allDaysInWeek = currentWeek.all(by.tagName('td'));
  var today = allDaysInWeek.filter(function(day, index) {
    return day.getText().then(function(no) {
      //what if the week day and the day no is the same, like Jan 1
      return no === todayNo.toString();
    });
  });
  today.click();
};

describe('Add Campaign', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  //***********buttons************/
  var signInButton = element(by.id('signIn'));
  var myCampaign = element(by.id('myCampaign'));
  var datepicker = element(by.css('.calendar'));
  var dueDate = element(by.model('campaign.dueDate'));
  var submit = element(by.id('addCampaignBtn'));
  var youtubeUrl = element(by.model('campaign.youtubeUrl'));

  /****TESTS*********/
  it('should load the addCampaign page', function() {
    helper.logoutifLoggedIn();
    helper.login();
    myCampaign.click();
    expect(element(by.id('title')).isDisplayed()).toBe(true);
  });

  describe('Add Campaign form validation', function() {
    beforeEach(function() {
      myCampaign.click();
    });

    it('should not accept Title with Less Than 5 Characters or', function() {
      var title = element(by.model('campaign.title'));
      title.sendKeys('TEST');
      expect(element(by.id('lessThan5')).isDisplayed()).toBe(true);
      title.clear();
      //sending an a string of empty characters
      title.sendKeys('         ');
      expect(element(by.id('campaignIsRequired')).isDisplayed()).toBe(true);
    });

    it('should not accept description with Less Than 20 Characters', function() {
      var description = element(by.model('campaign.description'));
      description.sendKeys('These Characters');
      expect(element(by.id('lessThan20')).isDisplayed()).toBe(true);
      description.clear();
      //sending an a string of empty characters
      description.sendKeys('                                   ');
      expect(element(by.id('descriptionErr')).isDisplayed()).toBe(true);
    });

    it('should accept only numbers', function() {
      //TYPE NUMBER FIELD NOT CLEARING PROBLEM WITH PROTRACTOR https://github.com/angular/protractor/issues/1583
      var amount = element(by.model('campaign.amount'));
      amount.sendKeys('asdfghjkl');
      expect(element(by.id('isInvalidErr')).isDisplayed()).toBe(true);
    });

    it('should validate wrong youtube url', function() {
      youtubeUrl.sendKeys('wrong url format');
      expect(submit.isEnabled()).toBe(false);
      expect(youtubeUrl.getAttribute('class')).toContain('ng-invalid-url');
      expect(element(by.id('invalid-url')).isDisplayed()).toBe(true);
    });

    it('should validate wrong youtube url', function() {
      expect(youtubeUrl.getAttribute('class')).toContain('ng-pristine');
      youtubeUrl.sendKeys('www.youtube.com');
      expect(submit.isEnabled()).toBe(false);
      expect(youtubeUrl.getAttribute('class')).toContain('ng-invalid-url');
      expect(element(by.id('invalid-url')).isDisplayed()).toBe(true);
    });

    it('should validate incomplete youtube video id', function() {
      youtubeUrl.sendKeys('https://www.youtube.com/watch?v=mq59iE3');
      expect(element(by.binding('youtubeError')).isDisplayed()).toBe(true);
    });

    it('should validate wrong youtube video id via youtube API', function() {
      youtubeUrl.sendKeys('https://www.youtube.com/watch?v=mq59iE4MhaM');
      expect(element(by.binding('youtubeError')).isDisplayed()).toBe(true);
    });

    it('should allow correct input youtube url', function() {
      youtubeUrl.sendKeys('https://www.youtube.com/watch?v=mq59iE3MhXM');
      expect(element(by.binding('youtubeError')).isDisplayed()).toBe(false);
      expect(youtubeUrl.getAttribute('class')).toContain('ng-valid');
      expect(youtubeUrl.getAttribute('class')).toContain('ng-valid-url');
    });

    it('should disabled date field on page load', function() {
      expect(dueDate.isEnabled()).toBe(false);
    });

    it('should be able to pick date via the datepicker', function() {
      datepicker = element(by.css('.calendar'));
      expect(datepicker.isDisplayed()).toBe(true);
      expect(element(by.css('ul.dropdown-menu')).isDisplayed()).toBe(false);
      datepicker.click();
      expect(element(by.css('ul.dropdown-menu')).isDisplayed()).toBe(true);
    });

    it('should allow users to pick valid date from the datepicker', function() {
      // what of when the day of the weeks falls on the last week,
      // a new week would be on another page or another month
      var weekNo = moment().add(7, 'days').isoWeek();
      var todayNo = moment().add(7, 'days').date();
      clickDate(weekNo, todayNo);
      expect(dueDate.getAttribute('value')).toContain(todayNo);
    });

    it('should not allow users to pick a date below the limit', function() {
      var weekNo = moment().subtract(7, 'days').isoWeek();
      var todayNo = moment().subtract(7, 'days').date();
      clickDate(weekNo, todayNo);
      expect(dueDate.getAttribute('value')).not.toContain(todayNo);
    });

    it('should not allow users to pick a date above the limit', function() {
      var weekNo = moment().add(31, 'days').isoWeek();
      var todayNo = moment().add(31, 'days').date();
      clickDate(weekNo, todayNo, true);
      expect(dueDate.getAttribute('value')).not.toContain(todayNo);
    });
  });
  //add more tests, not comprehensive enough
});
