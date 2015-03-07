'use strict';

angular.module('banker').config(['$stateProvider', function($stateProvider){
    $stateProvider
    .state('bank', {
       url: '/bank',
       templateUrl: 'modules/banker/views/bankers.client.view.html'
    });
  }
]);
