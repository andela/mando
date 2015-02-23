'use strict';
/* global it describe browser expect */
var helper = require('./helpers.authentication.e2e.client.Spec');

describe('Andonation HomePage', function() {
  it('should have a title', function() {
    helper.loadApp();
    expect(browser.getTitle()).toEqual('Andonation');
  });
});