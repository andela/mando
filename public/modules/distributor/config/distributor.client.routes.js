'use strict';

angular.module('distributor').config(['$stateProvider',function($stateProvider) {

  $stateProvider.
    state('distributorOverview', {
      url: '/distributor/users',
      templateUrl: 'modules/distributor/views/distributor.client.view.html'
    });
}]);
