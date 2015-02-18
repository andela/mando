'use strict';
//config file for protractor
exports.config = {

  baseUrl: 'http://localhost:3000',
  //multicapabilities to run different instances of the browser
  multiCapabilities: [{
    'browserName': 'chrome',
    'specs': ['app/tests/e2e/*Spec.js'],
    'exclude': ['app/tests/e2e/e2e.authentication.Spec.js']
  }, {
    'browserName': 'chrome',
    'specs': ['app/tests/e2e/e2e.authentication.Spec.js']
  }],
  onPrepare: function() {
    // The require statement must be down here, since jasmine-reporters@1.0
    // needs jasmine to be in the global and protractor does not guarantee
    // this until inside the onPrepare function.
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
        new jasmine.JUnitXmlReporter('xmloutput', true, true)
    );
  }
};