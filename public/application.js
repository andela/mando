'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
    // debugger
    // $locationProvider.html5Mode({enabled:true});
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	// if (window.location.hash === '#_=_') window.location.hash = '#!';

  if (window.location.href[window.location.href.length - 1] === '#' && (window.location.href.length - window.location.origin.length) === 2) {
      window.location.href = window.location.origin + '/#!';
  }

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});