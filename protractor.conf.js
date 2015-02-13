//config file for protractor
exports.config = {

  baseUrl: 'http://localhost:3000',
  //multicapabilities to run different instances of the browser
  multiCapabilities: [{
    'browserName': 'chrome',
    'specs': ['public/modules/e2e/*Spec.js'],
    'exclude': ['public/modules/e2e/e2e.authentication.Spec.js']
  }, {
    'browserName': 'chrome',
    'specs': ['public/modules/e2e/e2e.authentication.Spec.js']
  }]
 };