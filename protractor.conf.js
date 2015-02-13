// conf.js
exports.config = {
 // seleniumAddress: 'http://localhost:4444/wd/hub',
//  specs: ['home.login.spec.js'],

  baseUrl: 'http://localhost:3000',   
   
  specs: ['public/modules/e2e/*Spec.js']   
 };