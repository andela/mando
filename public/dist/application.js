'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'andonation';
	var applicationModuleVendorDependencies = ['ngResource', 'toaster', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'youtube-embed', 'ngLodash'];

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

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('admin');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('banker');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('campaign');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';


// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('distributor');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

angular.module('admin').config(['$stateProvider',function($stateProvider) {

  $stateProvider.
    state('allUsers', {
      url: '/admin/users',
      templateUrl: 'modules/admin/views/users.admin.client.view.html'
    });
}]);

'use strict';

angular.module('admin').controller('ModalInstanceCtrl', ['$scope', 'adminBackendService', '$modalInstance', 'roles', 'len', '$timeout', function($scope, adminBackendService, $modalInstance, roles, len, $timeout) {
  $scope.NoOfUser = len;
  adminBackendService.getRoles().success(function(data, status, header, config) {
    $scope.roles = data;
    if(len === 1) {
    for(var i=0; i < roles.length;i++) {
      for(var j=0; j< $scope.roles.length; j++) {
        if(roles[i].roleType === $scope.roles[j].roleType) {
          if(roles[i].isAdmin === true) {
            $scope.roles[j].isAdmin = roles[i].isAdmin;
          }
          $scope.roles[j].count = roles[i].count;
          $scope.roles[j].checked = true;
        }
      }
    }
  } else {
    for(var x=0; x < roles.length;x++) {
      for(var y=0; y< $scope.roles.length; y++) {
        if(roles[x].roleType === $scope.roles[y].roleType) {
          if(roles[x].isAdmin === true) {
            $scope.roles[y].isAdmin = roles[x].isAdmin;
          }
          $scope.roles[y].count = roles[x].count;
          if($scope.roles[y].count < len) {
            $scope.roles[y].checked = 'indeterminate';
          } else {
            $scope.roles[y].checked = true;
          }
        }
      }
    }
  }
  }).error(function(error, status, header, config) {
    //handle error
  });
  $scope.disableSaveButton = function(isAdmin, checkStatus) {
    $timeout(function() {
      if (checkStatus !== 'indeterminate') {
        $scope.disable = (isAdmin && checkStatus);
      }
    }, 100);
  };

  $scope.ok = function () {
    $modalInstance.close($scope.roles);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
'use strict';

angular.module('admin').controller('adminUserCtrl', ['$scope', 'Authentication', 'adminBackendService', '$location', 'lodash', '$state', '$modal', 'toaster', '$timeout', function($scope, Authentication, adminBackendService, $location, lodash, $state, $modal, toaster, $timeout) {

  $scope.authentication = Authentication;
  Authentication.requireLogin($state);

  //redirects user to myAndonation is user is logged in and not an admin
  // if (!lodash.findWhere(Authentication.user.roles, {'roleType': 'admin'})) {
  //   $state.go('userCampaigns');


  Authentication.requireRole($state, 'admin', 'userCampaigns');

  adminBackendService.getUsers()
    .success(function(data, status, header, config) {
      $scope.users = data;

      for (var i = 0; i < $scope.users.length; i++) {
        $scope.users[i].checked = false;
      }
    })
    .error(function(error, status, header, config) {
      //do proper error handling
      $scope.error = error;
    });
  $scope.noChecked = true;

  $scope.check = function() {
    $timeout(function() {
      var count = 0;
      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].checked) {
          count++;
        }
      }
      $scope.noChecked = (count === 0);
      $scope.allChecked = (count === $scope.users.length);
    }, 100);
  };

  $scope.checkAll = function() {
    $timeout(function() {
      if ($scope.allChecked) {
        for (var i = 0; i < $scope.users.length; i++) {
          $scope.users[i].checked = true;
        }
        $scope.noChecked = false;
      } else {
        for (var j = 0; j < $scope.users.length; j++) {
          $scope.users[j].checked = false;
        }
        $scope.noChecked = true;
      }
    }, 100);
  };
  //activates the modal window
  $scope.openModal = function() {
    var roles = [];
    var count = 0,
      NoOfCheckedUsers = 0;
    angular.forEach($scope.users, function(user, key) {
      if (user.checked) {
        NoOfCheckedUsers++;
        for (var i = 0; i < user.roles.length; i++) {
          if (NoOfCheckedUsers > 1) {
            if (lodash.findWhere(roles, {
                'roleType': user.roles[i].roleType
              })) {
              var temp = lodash.findWhere(roles, {
                'roleType': user.roles[i].roleType
              });
              temp.count++;
            } else {
              if (user.roles[i].roleType === 'admin' && user._id === $scope.authentication.user._id) {
                user.roles[i].isAdmin = true;
              }
              user.roles[i].count = 1;
              roles.push(user.roles[i]);
            }
          } else {
            if (user.roles[i].roleType === 'admin' && user._id === $scope.authentication.user._id) {
              user.roles[i].isAdmin = true;
            }
            user.roles[i].count = 1;
            roles.push(user.roles[i]);
          }
        }
      }
    });

      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/admin/views/updateRoles.admin.modal.client.view.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm',
        resolve: {
          roles: function () {
            return roles;
          },
          len: function() {
            return NoOfCheckedUsers;
          }
        }
      });

      $scope.modalInstance.result.then(function (roles) {
        var data = {};
        data.roles = [];
        var addRoles = {addRoles: []};
        var rmRoles = {rmRoles: []};
        data.usersid = [];
        angular.forEach($scope.users, function(user) {
          if(user.checked) {
            data.usersid.push(user._id);
          }
        });
        for (var y = 0; y < roles.length; y++) {
          if(roles[y].checked === true) {
            addRoles.addRoles.push(roles[y]._id);
          } else if (roles[y].checked === false) {
            rmRoles.rmRoles.push(roles[y]._id);
          }
        }
      data.roles.push(addRoles);
      data.roles.push(rmRoles);
      adminBackendService.updateUserRoles(data).success(function(data, status, header, config) {
          $scope.users = data;
          $scope.allChecked = false;
          $scope.noChecked = true;
          toaster.pop('success', 'User Roles updated successfully');
        })
        .error(function(error, status, header, config) {
          toaster.pop('error', 'Error Occured, Please try again or contact the Admin');
        });
    });
  };

}]);

'use strict';

angular.module('campaign').factory('adminBackendService', ['$http', function($http) {

  var getUsers = function() {
    return $http.get('/admin/users');
  };

  var getRoles = function() {
    return $http.get('/admin/roles');
  };

  var updateUserRoles = function(data) {
    return $http.put('/admin/user/roles/edit', data);
  };

  return {
    getUsers: getUsers,
    updateUserRoles: updateUserRoles,
    getRoles: getRoles
  };
}]);
'use strict';

angular.module('banker').config(['$stateProvider', function($stateProvider){
    $stateProvider
    .state('bank', {
      resolve: {
        credentials: ["$http", function ($http){
          return  $http.get('/bank/credentials');
        }]
      },
       url: '/bank',
       controller: 'transactionCtrl',
       templateUrl: 'modules/banker/views/bankers.client.view.html'
    });
  }
]);

'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl', ['$scope', 'Authentication', '$http', '$timeout', 'toaster', '$modal', 'subledgerServices', 'lodash', 'credentials', '$state', function($scope, Authentication, $http, $timeout, toaster, $modal, subledgerServices, lodash, credentials, $state) {

  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'banker', 'userCampaigns');
  $scope.reports = [];
  $scope.journal = [];
  $scope.withdrawal = {};
  $scope.balance = {
    amount: ''
  };

  // Check if the user has a banker role.
  $scope.isBanker = Authentication.hasRole('banker');

  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  subledgerServices.setCredentials(cred);
  $scope.authentication = Authentication;

  //Method to Get The Bank Balance

  $scope.getBankBalance = function(account) {
    subledgerServices.getBalance(account, function(response) {
      $scope.balance.amount = response;
      $scope.$digest();
    });
  };
  $scope.getBankBalance(cred.bank_id);

  //get All lines of transaction
  $scope.getJournals = function(account) {
    subledgerServices.getJournals(account, function(response) {
      $scope.journal = response.posted_lines;
      $scope.$digest();
    });
  };
  $scope.getJournals(cred.bank_id);


  //Grab Some details of the Auhtenticated user and convert it to a string which will be stored in subledger the returned string is converted back into an object.

  $scope.withdrawFromBank = function(amount, user) {
    subledgerServices.bankerAction('debit', amount, cred.system_id, cred.bank_id, $scope.authentication.user, function() {
      $scope.getBankBalance(cred.bank_id);
      $scope.getJournals(cred.bank_id);
    });
  };

  $scope.depositIntoBank = function(amount, user) {
    subledgerServices.bankerAction('credit', amount, cred.system_id, cred.bank_id, $scope.authentication.user, function() {
      $scope.getBankBalance(cred.bank_id);
      $scope.getJournals(cred.bank_id);
    });
  };
  // OPEN MODAL WINDOW
  $scope.openModalWithdraw = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/banker/views/withdraw.modal.view.html',
      controller: 'withdrawalModalInstanceCtrl',
      size: size,
      resolve: {
        transaction: function() {
          return $scope.balance.amount;
        }
      }
    });
    modalInstance.result.then(function(amount) {
      $scope.withdrawFromBank(amount);
      toaster.pop('success', 'Transaction Completed');
    });
  };
  //OPEN MODAL WINDOW
  $scope.openModalDeposit = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/banker/views/deposit.modal.view.html',
      controller: 'depositModalInstanceCtrl',
      size: size
    });
    modalInstance.result.then(function(amount) {
      $scope.depositIntoBank(amount);
      toaster.pop('success', 'Transaction Completed');

    });
  };
}]);

'use strict';

//modal Controller
angular.module('banker').controller('withdrawalModalInstanceCtrl', ['$scope', '$modalInstance', 'transaction', function($scope, $modalInstance, transaction) {
  $scope.withdraw = 0;
  $scope.systemBalance = transaction;
  $scope.checkBalance = function() {
    if ($scope.systemBalance < $scope.withdraw) {
      $scope.accountIsLower = true;
      $scope.message = true;
    } else {
      $scope.accountIsLower = false;
      $scope.message = false;
    }
  };
  $scope.ok = function(withdraw) {
    $modalInstance.close(withdraw);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);

angular.module('banker').controller('depositModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
  $scope.deposit = 0;
  $scope.ok = function(deposit) {
    $modalInstance.close(deposit);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';
/*global Subledger*/

angular.module('banker').factory('subledgerServices', ['$http', 'toaster', function($http, toaster) {
  var subledger = new Subledger();
  var credentials = {};
  var cred = {};

  var setCredentials = function(data) {
    subledger.setCredentials(data.key_id, data.secret_id);
    cred = data;

  };

  var getSystemBalance = function(org_id, book_id, account_id) {
    return subledger.organization(org_id).book(book_id).account(account_id);
  };

  var createAndPostTransaction = function(org_id, book_id) {
    return subledger.organization(org_id).book(book_id).journalEntry();
  };

  var getJournalReports = function(org_id, book_id, account_id) {
    var org = subledger.organization(org_id);
    var book = org.book(book_id);
    var account = book.account(account_id);
    return account.line();
  };
  var getCredentials = function() {
    return $http.get('/bank/credentials').success(function(data, status, header, config) {
      credentials = data;
    });
  };


  //Get SystemBalance
  var getBalance = function(account, cb) {
    var date = new Date().toISOString();
    getSystemBalance(cred.org_id, cred.book_id, account).balance({
      description: 'USD',
      at: date
    }, function(error, apiRes) {
      if (error) {
        // toaster.pop('error', 'An Error Occurred' + error);
        return error;
      } else {
        var amount = parseInt(apiRes.balance.value.amount);
        cb(amount);
      }
    });
  };

  /*  WITHDRAW and DEPOSIT in and Out of the Syetem.
    Performs Crediting and Debiting of Accounts  
    Action == credit or Debit
    transaction = {
     amount: Amount to Credit/Debit
     reason : Reason for Debiting or Crediting If Its from a Distributor to a User other transactions do not have reasons
       
    }
    inititorAccount ="Account that initiated the transaction which can be a banker"
    recipientAccoutn = "Accoutn that accepts the transation"
    initiatorl: this is the logged in user that authorises the transaction.
    cb : callback
  */
  var bankerAction = function(action, transaction, initiatorAccount, recipientAccount, initiator, cb) {
    var otherAction = action === 'debit' ? 'credit' : 'debit';

    var description = (action === 'debit') ? transaction.reason || 'Cash Withrawal from Bank' : transaction.reason || 'Cash Deposit To Bank';
    var initiatorToString = JSON.stringify({
      name: initiator.displayName,
      email: initiator.email,
      description: description
    });

    createAndPostTransaction(cred.org_id, cred.book_id).createAndPost({
      'effective_at': new Date().toISOString(),
      'description': initiatorToString,
      'reference': 'http://andonation-mando.herokuapp.com',
      'lines': [{
        'account': recipientAccount,
        'description': initiatorToString,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': action,
          'amount': transaction.amount
        }
      }, {
        'account': initiatorAccount,
        'description': initiatorToString,
        'reference': 'http://andonation-mando.herokuapp.com',
        'value': {
          'type': otherAction,
          'amount': transaction.amount
        }
      }]
    }, function(error, apiRes) {
      if (error) {
        return error;
      } else {
        cb(apiRes);
      }
    });
  };

  //Get Journal Reports for any Transaction.
  // PARAMs  account to get the journal and a callback
  var getJournals = function(account, cb) {
    getJournalReports(cred.org_id, cred.book_id, account).get({
      'description': 'USD',
      'action': 'before',
      'effective_at': new Date().toISOString()
    }, function(error, apiRes) {
      if (error) {
        return error;
      } else {
        for (var i = 0; i < apiRes.posted_lines.length; i++) {
          try {
            var stringToObj = JSON.parse(apiRes.posted_lines[i].description);
            apiRes.posted_lines[i].description = stringToObj;
          } catch (e) {
            apiRes.posted_lines[i].description = {
              'name': 'anonymous',
              'description': apiRes.posted_lines[i].description
            };
          }
        }
        cb(apiRes);
      }
    });
  };

  return {
    getSystemBalance: getSystemBalance,
    createAndPostTransaction: createAndPostTransaction,
    getJournalReports: getJournalReports,
    getCredentials: getCredentials,
    setCredentials: setCredentials,
    getBalance: getBalance,
    bankerAction: bankerAction,
    getJournals: getJournals
  };
}]);

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
    url: '/campaign/:campaignTimestamp/:campaignslug/edit',
    templateUrl: 'modules/campaigns/views/editCampaign.client.view.html'
  }).
  state('viewCampaign', {
    url: '/campaign/:campaignTimeStamp/:campaignslug',
    resolve: {
      credentials: ["$http", function($http) {
        return $http.get('/bank/credentials');
      }]
    },
    templateUrl: 'modules/campaigns/views/viewCampaign.client.view.html',
    controller: 'viewCampaignCtrl'
  }).
  state('allCampaigns', {
    url: '/campaigns',
    templateUrl: 'modules/campaigns/views/allCampaigns.client.view.html'
  }).
  state('allTransactions', {
    resolve: {
      credentials: ["$http", function($http) {
        return $http.get('/bank/credentials');
      }]
    },
    controller: 'userTransactionCtrl',
    url: '/myTransactions',
    templateUrl: 'modules/campaigns/views/userTransaction.client.view.html',
  }).
  state('userCampaigns', {
    resolve: {
      credentials: ["$http", function($http) {
        return $http.get('/bank/credentials');
      }]
    },
    url: '/campaigns/myAndonation',
    templateUrl: 'modules/campaigns/views/userCampaigns.client.view.html',
    controller: 'userCampaignsCtrl'
  });

  //Add YouTube to resource whitelist so that we can embed YouTube videos
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
}]);

'use strict';

/*global moment */

angular.module('campaign').controller('addCampaignCtrl', ['$scope', 'toaster', 'backendService', '$location', 'Authentication', 'youtubeEmbedUtils', '$state',
  function($scope, toaster, backendService, $location, Authentication, youtubeEmbedUtils, $state) {
    //provides the authentication object
    $scope.authentication = Authentication;
    $scope.campaign = {};

    //using moment.js to manipulate date
    $scope.minDate = moment().add(1, 'days');
    $scope.maxDate = moment().add(30, 'days');

    //if unauthenticated, go to home
    Authentication.requireLogin($state);

    $scope.addCampaign = function() {
      $scope.campaign.youtubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.youtubeUrl);
      backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
          toaster.pop('success', $scope.campaign.title, 'Campaign created successfully');
          $location.path('/campaign/' + data.slug);
        })
        .error(function(error, status, header, config) {
          //no $scope.error on the view, need to work on the error
          $scope.error = error;
        });
    };

    $scope.validateYoutubeUrl = function(url, isValid) {
      //checks if input is a valid url
      if (!isValid) {
        $scope.youtubeError = 'Please enter a valid youtube Url';
        return;
      }
      //get the youtube id from the url
      var youtubeId = youtubeEmbedUtils.getIdFromURL(url);
      //if the youtubeid is the same as url, then the user entered a wrong youtube url/id
      if (youtubeId === url) {
        $scope.youtubeError = 'Please enter a valid youtube URL';
        return;
      }
      backendService.checkYouTubeUrl(youtubeId)
        .success(function(result) {
          $scope.youtubeError = '';
          // Add campaign in youtube url is valid
        })
        .error(function(error) {
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

angular.module('campaign').controller('allCampaignCtrl', ['$scope', '$location', 'backendService', function($scope, $location, backendService) {
  $scope.Campaigns = [];
  $scope.criteria = 'created';
  $scope.currentPage = 1;
  $scope.itemsPerPage = 21;
  $scope.totalItems = 1;

  $scope.init = function() {
    backendService.getCampaigns()
      .success(function(data, status, header, config) {
        $scope.campaigns = data;
        $scope.totalItems = data.length;
        $scope.filterCampaigns();
      })
      .error(function(error, status, header, config) {
        return error;
      });
  };

  $scope.filterCampaigns = function() {
    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
    var end = begin + $scope.itemsPerPage;
    $scope.startItems = begin + 1;
    if (end < $scope.totalItems) {
      $scope.endItems = end;
    } else {
      $scope.endItems = $scope.totalItems;
    }
    $scope.Campaigns = $scope.campaigns.slice(begin, end);
  };

  $scope.pageChanged = function() {
    $scope.filterCampaigns();
  };
  $scope.init();
}]);

'use strict';

/*global moment */
angular.module('campaign').controller('editCampaignCtrl', ['$scope', 'toaster', 'backendService', '$location', 'Authentication', '$stateParams', 'youtubeEmbedUtils', '$state', function($scope, toaster, backendService, $location, Authentication, $stateParams, youtubeEmbedUtils, $state) {
  $scope.authentication = Authentication;
  Authentication.requireLogin($state);

  $scope.getCampaign = function() {
    backendService.getCampaign($stateParams.campaignTimestamp + '/' + $stateParams.campaignslug)
      .success(function(data, status) {
        if ($scope.authentication.user._id !== data.createdBy._id) {
          $location.path('/campaign/' + data.slug);
        }
        //The Date of Campaign cannot exceed 30 days of the date it was created
        $scope.minDate = moment(data.created);
        $scope.maxDate = moment(data.created).add(30, 'days');
        $scope.campaign = data;
        $scope.campaign.youtubeUrl = 'https://www.youtube.com/watch?v=' + data.youtubeUrl;
      })
      .error(function(err) {
        toaster.pop('error', 'An Error Occurred' + err);
      });
  };
  $scope.getCampaign();
  $scope.editCampaign = function() {
    delete $scope.campaign.createdBy;
    delete $scope.campaign.created;
    $scope.campaign.youtubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.youtubeUrl);
    backendService.updateCampaign($scope.campaign)
      .success(function(data, status, header, config) {
        toaster.pop('success', 'Campaign Edited Successfully');
        $location.path('/campaign/' + data.slug);
      })
      .error(function(err, status, header, config) {
        $scope.error = err;
        toaster.pop('error', 'An Error Occurred:' + err);
      });
  };

  $scope.validateYoutubeUrl = function(url) {
    var youtubeId = youtubeEmbedUtils.getIdFromURL(url);
    //if the youtubeid is the same as url, then the user entered a wrong youtube url/id
    if (youtubeId === url) {
      $scope.youtubeError = 'Please enter a valid youtube URL';
      return;
    }

    backendService.checkYouTubeUrl(youtubeId)
      .success(function(result) {
        $scope.youtubeError = '';
        // Add campaign in youtube url is valid
      })
      .error(function(error) {
        $scope.youtubeError = error;
      });
  };

  $scope.deleteCampaign = function(data, toastr) {
    var confirmMsg = confirm('Do you want to delete this Campaign?');
    if (confirmMsg) {
      backendService.deleteCampaign($scope.campaign._id).success(function(text) {
        toaster.pop('success', $scope.campaign.title, 'Campaign deleted successfully');
        $location.path('/campaigns/myAndonation');
      }).error(function(error) {
        //do a more comprehensive error checking
      });
    }

  };

  //Open the Calendar
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
}]);

'use strict';

angular.module('campaign').controller('supportCampaignCtrl', ['$scope', 'campaignAccountId', 'amountNeeded', 'subledgerServices', 'Authentication', '$modalInstance', function($scope, campaignAccountId, amountNeeded, subledgerServices, Authentication, $modalInstance) {

  subledgerServices.getBalance(Authentication.user.account_id, function(response) {
    $scope.userAccountBalance = response;
    $scope.$digest();
  });
  subledgerServices.getBalance(campaignAccountId, function(response) {
    $scope.campaignBalance = response;
    $scope.$digest();
  });
  $scope.amountNeeded = amountNeeded;

  $scope.ok = function() {
    var transaction = {
      amount: $scope.amount,
      reason: 'Support campaign'
    };
    subledgerServices.bankerAction('credit', transaction, Authentication.user.account_id, campaignAccountId, Authentication.user, function() {
      $modalInstance.close(true);
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancelled');
  };
}]);

'use strict';

angular.module('campaign').controller('userCampaignsCtrl', ['$scope', 'backendService', 'toaster', '$location', 'subledgerServices', 'Authentication', '$stateParams', 'lodash', 'credentials', '$state',
  function($scope, backendService, toaster, $location, subledgerServices, Authentication, $stateParams, lodash, credentials, $state) {

    $scope.myCampaigns = [];
    $scope.systemBalance = {};
    $scope.balance = {};
    $scope.authentication = Authentication;
    Authentication.requireLogin($state);
    //checks if user is an admin
    $scope.isAdmin = Authentication.hasRole('admin');
    $scope.isBanker = Authentication.hasRole('banker');
    var cred = credentials.data;
    subledgerServices.setCredentials(cred);

    $scope.isDistributor = Authentication.hasRole('distributor');

    //uses the Currently signed-in id to get the user id.
    var userid = $scope.authentication.user._id;

    backendService.getUserCampaigns(userid)
      .success(function(myCampaigns) {
        $scope.myCampaigns = myCampaigns;
      })
      .error(function(error, status, header, config) {
        //not cool to redirect the user if any error occured, should be improved by
        //checking for the exact error act base on the error
        $location.path('/');

      });

    $scope.getCurrentBalance = function(account, destination) {
      subledgerServices.getBalance(account, function(response) {
        destination.amount = response;
        $scope.$digest();
      });
    };
    $scope.getCurrentBalance(cred.bank_id, $scope.systemBalance);
    $scope.getCurrentBalance($scope.authentication.user.account_id, $scope.balance);

    //GET UNIQUE USER JOURNAL REPORTS  
    //this methods should only load the bank and  another method will load the user and filter it by 
    //query seems to be undefined here 
    $scope.getJournals = function(account) {
      subledgerServices.getJournals(account, function(response) {
        $scope.journal = response.posted_lines;
        url();
        $scope.$digest();
      });
    };
    $scope.getJournals($scope.authentication.user.account_id);

    //this function set the url of the user balance according to the number of transaction in the url
    var url = function() {
      if ($scope.journal.length < 3) {
        $scope.url = '#here';
      } else {
        $scope.url = '/#!/myTransactions';
        return $scope.url;
      }
    };


    // function to click the show more button on getMoreCampaigns page
    $scope.limit = 4;
    $scope.increment = function() {
      var campaignLength = $scope.myCampaigns.length;
      $scope.limit = campaignLength;
    };

    $scope.decrement = function() {
      $scope.limit = 4;
    };
  }
]);

'use strict';
angular.module('campaign').controller('userTransactionCtrl', ['$scope', '$http', '$state', 'subledgerServices', 'Authentication', 'credentials', function($scope, $http, $state, subledgerServices, Authentication, credentials) {
  $scope.authentication = Authentication;
  $scope.journal = {};
  $scope.balance = {};

  Authentication.requireLogin($state);
  var cred = credentials.data;
  subledgerServices.setCredentials(cred);
  $scope.authentication = Authentication;

  //Get the User Transaction Details from Subledger
  var getCurrentBalance = function(account, destination) {
    subledgerServices.getBalance(account, function(response) {
      destination.amount = response;
      $scope.$digest();
    });
  };
  getCurrentBalance($scope.authentication.user.account_id, $scope.balance);

  var getJournals = function(account) {
    subledgerServices.getJournals(account, function(response) {
      $scope.journal = response.posted_lines;
       $scope.$digest();
    });
  };
  getJournals($scope.authentication.user.account_id);
}]);



'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['credentials', '$scope', 'toaster', 'backendService', '$location', 'Authentication', '$stateParams', '$modal', 'subledgerServices',
  function(credentials, $scope, toaster, backendService, $location, Authentication, $stateParams, $modal, subledgerServices) {
    var campaignBalance, userAccountBalance;
    $scope.authentication = Authentication;
    var cred = credentials.data;
    subledgerServices.setCredentials(cred);
    backendService.getCampaign($stateParams.campaignTimeStamp + '/' + $stateParams.campaignslug)
      .success(function(data, status, header, config) {
        $scope.campaign = data;
        getCampaignBalance($scope.campaign.account_id);
        getUserAccountBalance(Authentication.user.account_id);
      })
      .error(function(error, status, header, config) {
        $location.path('/');
      });

    var getUserAccountBalance = function(userAccountid) {
      subledgerServices.getBalance(userAccountid, function(response) {
        userAccountBalance = response;
      });
    };
    var getCampaignBalance = function(campaignAccountid) {
      subledgerServices.getBalance(campaignAccountid, function(response) {
        $scope.campaignBalance = response;
      });
    };
    $scope.openModal = function() {
      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/campaigns/views/supportCampaign.modal.client.view.html',
        controller: 'supportCampaignCtrl',
        size: 'sm',
        resolve: {
          campaignAccountId: function() {
            return $scope.campaign.account_id;
          },
          amountNeeded: function() {
            return $scope.campaign.amount;
          },
        }
      });
      $scope.modalInstance.result.then(function(status) {
        backendService.getCampaign($stateParams.campaignTimeStamp + '/' + $stateParams.campaignslug)
          .success(function(data, status, header, config) {
            toaster.pop('success', 'Success! - Thanks for supporting this campaign');
            $scope.campaign = data;
            getCampaignBalance($scope.campaign.account_id);
            getUserAccountBalance(Authentication.user.account_id);
          });
      });
    };
  }
]);

'use strict';

angular.module('campaign').factory('backendService', ['$http', function($http) {

  //creates a campaign
  var addCampaign = function(campaignData) {
    return $http.post('/campaign/add', campaignData);
  };

  var getCampaign = function(campaignid) {
    return $http.get('/campaign/' + campaignid);
  };

  var deleteCampaign = function(campaignid) {
    return $http.delete('/campaign/' +campaignid);
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
    return $http.put('/campaign/' + campaignData._id + '/edit', campaignData);
  };

  return {
    addCampaign: addCampaign,
    getCampaign: getCampaign,
    checkYouTubeUrl: checkYouTubeUrl,
    getUserCampaigns: getUserCampaigns,
    updateCampaign: updateCampaign,
    deleteCampaign: deleteCampaign,
    getCampaigns: getCampaigns,
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

    $scope.myInterval = 2000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'modules/core/img/app-images/caros1.jpg' + 'modules/core/img/app-images/andela.png' + 'modules/core/img/app-images/andela.png',
        text: ['Happy','Laugh','Honesty']
      });
    };
    for (var i=0; i<4; i++) {
    $scope.addSlide();
    }

	}
]);

// $scope.myInterval = 5000;
//   var slides = $scope.slides = [];
//   $scope.addSlide = function() {
//     var newWidth = 600 + slides.length + 1;
//     slides.push({
//       image: 'http://placekitten.com/' + newWidth + '/300',
//       text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
//         ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
//     });
//   };
//   for (var i=0; i<4; i++) {
//     $scope.addSlide();
//   }
// });
'use strict';

angular.module('distributor').config(['$stateProvider',function($stateProvider) {

  $stateProvider.
    state('distributorOverview', {
      resolve: {
        credentials: ["$http", function ($http){
          return  $http.get('/bank/credentials');
        }]
      },
      controller: 'distributorCtrl',
      url: '/distributor/users',
      templateUrl: 'modules/distributor/views/distributor.client.view.html'
    });
}]);

'use strict';

angular.module('distributor').controller('distributorCtrl', ['$scope', 'Authentication', 'subledgerServices', 'distributorServices', '$location', '$state', '$modal', 'toaster', 'credentials', function($scope, Authentication, subledgerServices, distributorServices, $location, $state, $modal, toaster, credentials) {

  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  $scope.authentication = Authentication;
  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'distributor', 'userCampaigns');

  //Get All The Users Inn the System ANd populates it with their System Balance...
  $scope.getUsers = function() {
    distributorServices.getAllUsers().success(function(data) {
      $scope.users = data;
      for (var i = 0; i < $scope.users.length; i++) {
        var accountNo = data[i].account_id;
        $scope.getCurrentBalance(accountNo, $scope.users[i]);
      }
    }).error(function(error) {
      $scope.error = error;
    });
  };
  $scope.getUsers();
  //Method to populate each user's account with their system balance

  $scope.getCurrentBalance = function(account, destination) {
    subledgerServices.getBalance(account, function(response) {
      destination.amount = response;
      $scope.$digest();
    });
  };
  // $scope.getCurrentBalance(cred.bank_id, $scope.systemBalance);
  // $scope.getCurrentBalance($scope.authentication.user.account_id, $scope.balance);

  //method to credit each account
  $scope.depositIntoUser = function(transaction, user) {
    subledgerServices.bankerAction('credit', transaction, cred.bank_id, user.account_id, $scope.authentication.user, function() {
      $scope.getUsers();
    });
  };

  //method to debit each user account
  $scope.withdrawFromUser = function(transaction, user) {
    // Compare with user balance
    if (transaction.amount > user.amount) {
      toaster.pop('error', 'Balance is insufficient');
      return;
    }

    subledgerServices.bankerAction('debit', transaction, cred.bank_id, user.account_id, $scope.authentication.user, function() {
      $scope.getUsers();
    });
  };

  $scope.distributorModal = function(user, cb) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/distributor/views/distributor.modal.client.view.html',
      controller: 'disModalInstanceCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function(transaction) {
      cb(transaction, user);
    });
  };
}]);

'use strict';

angular.module('distributor').controller('disModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

  $scope.ok = function(transaction) {
    $modalInstance.close(transaction);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';
/*global Subledger*/

//This is just a repetition of the apis made in banker

angular.module('distributor').factory('distributorServices', ['$http', function($http) {
  var subledger = new Subledger();
  var cred = {};

  var setCredentials = function(data) {

    subledger.setCredentials(data.key_id, data.secret_id);
    cred = data;
    //subledger.setCredentials(key_id, secret);
  };

  var getAllUsers = function() {
    return $http.get('/distributor/users');
  };

  return {
    getAllUsers: getAllUsers,
    setCredentials: setCredentials
  };
}]);

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
angular.module('users').factory('Authentication', ['lodash',
	function(lodash) {
		var _this = this;
    var user = window.user;

		_this._data = {
			user: user,
      requireLogin: function($state, stateName) {
        if (!user) {
          $state.go(stateName || 'home');
        }
      },

      hasRole: function(role) {
        return lodash.findWhere(user.roles, {'roleType': role}) ? true : false;
      },
      requireRole: function($state, role, stateName) {
        //redirects user to myAndonation is user is logged in and not an admin
        if (!lodash.findWhere(user.roles, {'roleType': role})) {
          $state.go(stateName);
        }
      }
		};

		return _this._data;
	}
]);