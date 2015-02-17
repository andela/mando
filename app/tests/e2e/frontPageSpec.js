'use strict';
/* global it describe browser expect */
var helper = require('./helpers');

describe('Andonation HomePage', function() {
  it('should have a title', function() {
    helper.loadApp();
    expect(browser.getTitle()).toEqual('Andonation');
  });
});