'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'andonation';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('campaign');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

var helper = require('./helpers');

describe('Andonation Authentication', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  var signInButton = element(by.id('signIn'));
  // var googleSignIn = element(by.id('googleSignIn'));
  



  it('should accept only emails with andela.co domain name', function() {
    
    helper.logoutifLoggedIn();
    //log in
    helper.login('mirabelkoso@gmail.com', 'divinemimi');


    var myAndonation = browser.driver.findElement(by.id('myAndonation'));
    expect(myAndonation.isDisplayed()).toBe(false);
    var myCampaign = browser.driver.findElement(by.id('myCampaign'));
    expect(myCampaign.isDisplayed()).toBe(false);
    expect(signInButton.isDisplayed()).toBe(true);
    helper.logoutifLoggedIn();
  });
});
'use strict';
/* global it describe browser expect */
var helper = require('./helpers');

describe('Andonation HomePage', function() {
  it('should have a title', function() {
    helper.loadApp();
    expect(browser.getTitle()).toEqual('Andonation');
  });
});
'use strict';

//this file is to factor out test codes to avoid repetition,
//any code that would be repeat or used more than once should be written here
var elements = {
  signInButton: element(by.id('signIn')),
  signoutButton: element(by.id('signout'))
};
var helpers = {
  //loads the app at the given url
  loadApp: function(initialUrl) {
    initialUrl = initialUrl || '/';
    browser.get(initialUrl);
  },
  //login to the app
  login: function(email, password) {
    email = email || 'adebayo.maborukoje@andela.co';
    password = password || 'maborukoje2012'; //find a way to hide user credentials

    elements.signInButton.click();

    var emailInput = browser.driver.findElement(by.id('Email'));
    emailInput.sendKeys(email);
    var passwordInput = browser.driver.findElement(by.id('Passwd'));
    passwordInput.sendKeys(password);  //you should not commit this to VCS
    var googleSignIn = browser.driver.findElement(by.id('signIn'));
    googleSignIn.click();

    // we're about to authorize some permissions, but the button isn't enabled for a second
    browser.driver.sleep(2500);

    var submitApproveAccess = browser.driver.findElement(by.id('submit_approve_access'));
    submitApproveAccess.click();

    // this Allows Angular to Load
    browser.driver.sleep(5000);
  },
  logoutifLoggedIn: function() {
    elements.signoutButton.isDisplayed().then(function(isPresent) {
      if(isPresent) {
        elements.signoutButton.click();
      }
    });
  }
};

module.exports = helpers;
'use strict';
/* global describe */
var helper = require('./helpers');
describe('Andonation Homepage', function() {
  beforeEach(function() {
    helper.loadApp('/');
  });
  var signInButton = element(by.id('signIn'));

  it('should have a title', function() {
   expect(browser.getTitle()).toEqual('Andonation');
  });

  it('should show the signin button to unathenticated users', function() {
    expect(signInButton.isDisplayed()).toBe(true);
  });
  it('should not show myAndonation button to unauthenticated users', function() {
    expect(element(by.id('myCampaign')).isDisplayed()).toBe(false);
    expect(element(by.id('myAndonation')).isDisplayed()).toBe(false);
  });

  it('should display \'My Andonation\' Upon Successful login', function(){
    //logout any user if logged in
    helper.logoutifLoggedIn();
    //log in
    helper.login();

    var myAndonation = browser.driver.findElement(by.id('myAndonation'));
    expect(myAndonation.getText()).toBeDefined();
    
    var myCampaign = browser.driver.findElement(by.id('myCampaign'));
    expect(myCampaign.getText()).toBeDefined();
    expect(signInButton.isDisplayed()).toBe(false);
    helper.logoutifLoggedIn();
  });
  it('should show the signin button after logging out', function() {
    expect(signInButton.isDisplayed()).toBe(true);
  });
});


'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

angular.module('campaign').config(['$stateProvider', '$sceDelegateProvider', function($stateProvider, $sceDelegateProvider) {
  $stateProvider.
    state('addCampaign', {
      url: '/campaign/add',
      templateUrl: 'modules/campaigns/views/addCampaign.client.view.html'
    }).
    state('viewCampaign', {
      url: '/campaign/:campaignid',
      templateUrl: 'modules/campaigns/views/viewCampaign.client.view.html'
    });

    // Add YouTube to resource whitelist so that we can embed YouTube videos
    $sceDelegateProvider.resourceUrlWhitelist(['http://www.youtube.com/**']);
}]);
'use strict';

angular.module('campaign').controller('addCampaignCtrl', ['$scope', 'backendService',  '$location','Authentication',
  function($scope, backendService, $location, Authentication) {
    //provides the authentication object
    $scope.authentication = Authentication;
    $scope.campaign = {};
    $scope.minDate = moment().format();
    $scope.maxDate = moment().format();
    // console.log(1, backendService);
   // if unauthenticated, go to home
    if (!$scope.authentication.user) {
      $location.path('/');
    }
    $scope.addCampaign = function() {
      backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
          console.log(data);
          $location.path('/campaign/'+ data._id);
        })
        .error(function(error, status, header, config) {
          console.log(error);
        });
    };
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  }
]);
'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.authentication = Authentication;
    $scope.campaign = {
      _id: $stateParams.campaignid
    };
    if (!$scope.authentication.user) {
      $location.path('/');
    }
      backendService.getCampaign($scope.campaign)
      .success(function(data, status, header, config) {

          var youtube = data.youtubeUrl.split('watch?v=');
          if(youtube.length > 1){
            data.youtubeId = 'http://www.youtube.com/embed/'+youtube[1];
          }
          $scope.campaign = data;
          console.log(data);
          //$location.path('/campaign/'+ data._id);
        })
        .error(function(error, status, header, config) {
          console.log(error);
        });
    }
]);
'use strict';

angular.module('campaign').factory('backendService', ['$http', function($http) {

  //creates a campaign
  var addCampaign = function(campaignData) {
    return $http.post('/campaign/add', campaignData);
  };

  var getCampaign = function(campaignData) {
    return $http.get('/campaign/'+campaignData._id);
  };

  return {
    addCampaign: addCampaign,
    getCampaign: getCampaign
  };
}]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication',
  function($scope, Authentication) {
    $scope.authentication = Authentication;
  }
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('/');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);