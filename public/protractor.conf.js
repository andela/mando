// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
//  specs: ['home.login.spec.js'],
  specs: ['modules/*/tests/e2e/*.js']
};