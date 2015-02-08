'use strict';
/* global it describe browser expect */
describe('Andonation HomePage', function() {
  it('should have a title', function() {
    browser.get('http://localhost:3000');
    expect(browser.getTitle()).toEqual('Andonation');
  });
});