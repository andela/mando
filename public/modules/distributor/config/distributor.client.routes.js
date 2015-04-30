'use strict';

angular.module('distributor').config(['$stateProvider',function($stateProvider) {

  $stateProvider.
    state('distributorOverview', {
      resolve: {
        credentials: function ($http){
          return  $http.get('/bank/credentials');
        }
      },
      controller: 'distributorCtrl',
      url: '/distributor',
      templateUrl: 'modules/distributor/views/distributor.client.view.html'
    })

    .state('myDistribution', {
      resolve: {
        credentials: function ($http){
          return  $http.get('/bank/credentials');
        }
      },
      controller: 'myDistribution',
      url: '/distributor/myDistribution',
      templateUrl: 'modules/distributor/views/myDistribution.client.view.html'
    })
    .state('distributionUser', {
      resolve: {
        credentials: function ($http){
          return  $http.get('/bank/credentials');
        }
      },
      controller: 'userDistributionCtrl',
      url: '/distributor/:username',
      templateUrl: 'modules/distributor/views/user.distributor.client.view.html'
    });
}]);
