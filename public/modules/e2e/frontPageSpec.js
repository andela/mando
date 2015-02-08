'use strict';
/* global it describe browser expect */
describe('Andonation HomePage', function() {
  it('should have a title', function() {
    console.log(process.env.NODE_ENV)
    browser.get('http://localhost:3000');
    expect(browser.getTitle()).toEqual('Andonation')
  });
  it('should show a login button to authenticated users')
});