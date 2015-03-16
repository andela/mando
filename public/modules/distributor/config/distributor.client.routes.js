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
      url: '/distributor/users',
      templateUrl: 'modules/distributor/views/distributor.client.view.html'
    });
}]);
