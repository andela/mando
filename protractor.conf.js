exports.config = {
  //selenuimAddress: 'http://localhost:4444/wd/hub',
  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:3000',

  specs: ['public/modules/e2e/*Spec.js']
};