'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'andonation';
	var applicationModuleVendorDependencies = ['ngResource', 'toaster', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'youtube-embed'];

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

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

angular.module('campaign').config(['$stateProvider', 'datepickerConfig', '$sceDelegateProvider', function($stateProvider, datepickerConfig, $sceDelegateProvider) {
  //ui-bootstrap config service to set starting day to 1,
  //this is done because of the disparity in week number between moment.js and ui-bootstrap
  datepickerConfig.startingDay = '1';

  $stateProvider.
    state('addCampaign', {
      url: '/campaign/add',
      templateUrl: 'modules/campaigns/views/addCampaign.client.view.html'
    }).
    state('editCampaign', {
      url: '/campaign/:campaignid/edit',
      templateUrl: 'modules/campaigns/views/editCampaign.client.view.html'
    }).
    state('viewCampaign', {
      url: '/campaign/:campaignid',
      templateUrl: 'modules/campaigns/views/viewCampaign.client.view.html'
    }).
    state('userCampaigns', {
      url: '/campaigns/:userid',
      templateUrl: 'modules/campaigns/views/userCampaigns.client.view.html'
    });

    //Add YouTube to resource whitelist so that we can embed YouTube videos
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
}]);

'use strict';

/*global moment */

angular.module('campaign').controller('addCampaignCtrl', ['$scope','toaster', 'backendService',  '$location','Authentication', 'youtubeEmbedUtils',
  function($scope, toaster, backendService, $location, Authentication, youtubeEmbedUtils) {
    //provides the authentication object
    $scope.authentication = Authentication;
    $scope.campaign = {};

    //using moment.js to manipulate date
    $scope.minDate = moment().add(1, 'days');
    $scope.maxDate = moment().add(30, 'days');

   //if unauthenticated, go to home
    if (!$scope.authentication.user) {
      $location.path('/');
    }

    $scope.addCampaign = function() {
      $scope.campaign.youtubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.youtubeUrl);
        backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
            toaster.pop('success', $scope.campaign.title, 'Campaign created successfully');
          $location.path('/campaign/'+ data._id);
        })
        .error(function(error, status, header, config) {
          $scope.error = error;
        });
    };

    $scope.validateYoutubeUrl = function (url, isValid) {
      //checks if input is a valid url
      if(!isValid) {
        $scope.youtubeError = 'Please enter a valid youtube Url';
        return;
      }
      //get the youtube id from the url
      var youtubeId = youtubeEmbedUtils.getIdFromURL(url);
      //if the youtubeid is the same as url, then the user entered a wrong youtube url/id
      if(youtubeId === url) {
        $scope.youtubeError = 'Please enter a valid youtube URL';
        return;
      }
      backendService.checkYouTubeUrl(youtubeId)
        .success(function (result) {
          $scope.youtubeError = '';
          // Add campaign in youtube url is valid
        })
        .error(function (error){
          $scope.youtubeError = error;
        });
    };

    //to open the calendar
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  }
]);
'use strict';

/*global moment */
angular.module('campaign').controller('editCampaignCtrl', ['$scope','toaster', 'backendService', '$location', 'Authentication','$stateParams','youtubeEmbedUtils', function ($scope,toaster, backendService, $location, Authentication, $stateParams, youtubeEmbedUtils) {
    $scope.authentication = Authentication;

    if(!$scope.authentication.user){
        $location.path('/');
    }
     $scope.campaign = {
        _id: $stateParams.campaignid
     };

    backendService.getCampaign($scope.campaign)
      .success(function(data, status){
        if($scope.authentication.user._id !== data.createdBy._id){
          $location.path('/campaign/'+ data._id);
        }
        //The Date of Campaign cannot exceed 30 days of the date it was created 
        $scope.minDate = moment(data.created);
        $scope.maxDate = moment(data.created).add(30, 'days');
        $scope.campaign = data;
        $scope.campaign.youtubeUrl = 'https://www.youtube.com/watch?v='+data.youtubeUrl;
      })
      .error(function(err){
        toaster.pop('error', 'An Error Occurred'+ err);
    });

    $scope.editCampaign = function(){
    delete $scope.campaign.createdBy;
    delete $scope.campaign.created;
    $scope.campaign.youtubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.youtubeUrl);
      backendService.updateCampaign($scope.campaign)
      .success(function(data, status, header, config){
        toaster.pop('success', 'Campaign Edited Successfully');
        $location.path('/campaign/' + data._id);
      })
      .error(function(err,status, header, config){
        $scope.error = err;
        toaster.pop('error','An Error Occurred:'+ err);
      });
    };

    $scope.validateYoutubeUrl = function (url) {
      var youtubeId = youtubeEmbedUtils.getIdFromURL(url);
      //if the youtubeid is the same as url, then the user entered a wrong youtube url/id
      if(youtubeId === url) {
        $scope.youtubeError = 'Please enter a valid youtube URL';
        return;
      }

      backendService.checkYouTubeUrl(youtubeId)
        .success(function (result) {
          $scope.youtubeError = '';
          // Add campaign in youtube url is valid
        })
        .error(function (error){
          $scope.youtubeError = error;
      });
    };

    $scope.deleteCampaign = function(data, toastr) {
       var confirmMsg = confirm('Do you want to delete this Campaign?');
      if(confirmMsg === true) {
          backendService.deleteCampaign($scope.campaign).success(function(text) {
          toaster.pop('success', $scope.campaign.title, 'Campaign deleted successfully');
          $location.path('/campaigns/:userId');
          console.log('deleted');
          }).error(function(error) {
          console.log('error');
        });
      }

  };

    //Open the Calendar
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  }
]);
'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.myCampaigns    = [];
  $scope.authentication = Authentication;
  if (!$scope.authentication.user || !$stateParams.userid) {
    $location.path('/');
  }
  // using the backend service to get campaign data from the back end
  var userid = $scope.authentication.user._id;
  backendService.getUserCampaigns(userid).success(function(myCampaigns) {
    if (myCampaigns.length < 1) {
       myCampaigns = false;
    } else {
    $scope.myCampaigns = myCampaigns;
     myCampaigns = false;
  }
  });

  // function to click the show more button on getMoreCampaigns page
  $scope.limit = 4;
  $scope.increment = function() {
    var campaignLength = $scope.myCampaigns.length;
    $scope.limit = campaignLength;
  };

  $scope.decrement = function() {
    $scope.limit = 4;
  };
}]);
'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope','toaster' , 'backendService','$location', 'Authentication', '$stateParams',
function($scope, toaster, backendService,$location, Authentication, $stateParams) {
  $scope.authentication = Authentication;
    if (!$scope.authentication.user || !$stateParams.campaignid) {
      $location.path('/');
    }
    $scope.campaign = {
      _id: $stateParams.campaignid
    };

    backendService.getCampaign($scope.campaign)
    .success(function(data, status, header, config) {
      $scope.campaign = data;
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
    return $http.get('/campaign/' +campaignData._id);
  };

  var deleteCampaign = function(campaignData) {
    return $http.delete('/campaign/' +campaignData._id);
  };

  var checkYouTubeUrl = function(videoId) {
    return $http.get('//gdata.youtube.com/feeds/api/videos/'+videoId+'?alt=json');
  };

  var getUserCampaigns = function(userid) {
    return $http.get('/campaigns/' + userid);
  };

  //get all campaigns for the homepage
  var getCampaigns = function() {
    return $http.get('/campaigns');
  };

  var updateCampaign = function(campaignData) {
    console.log(campaignData);
    return $http.put('/campaign/' + campaignData._id + '/edit', campaignData);
  };

  return {
    addCampaign: addCampaign,
    getCampaign: getCampaign,
    checkYouTubeUrl: checkYouTubeUrl,
    getUserCampaigns: getUserCampaigns,
    updateCampaign: updateCampaign,
    deleteCampaign: deleteCampaign,
    getCampaigns: getCampaigns
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
    $scope.isCollapsed = false;
  
    $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
    }
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'backendService',
	function($scope, Authentication, backendService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.campaigns = [];

    backendService.getCampaigns()
      .success(function(data, status, header, config) {
        $scope.campaigns = data;
      })
      .error(function(error, status, header, config) {
        $scope.error = error;
      });
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