'use strict';

angular.module('banker').config(['$stateProvider', function($stateProvider){
    $stateProvider
    .state('bank', {
      resolve: {
        credentials: function ($http){
          return  $http.get('/bank/credentials');
        }
      },
       url: '/bank',
       controller: 'transactionCtrl',
       templateUrl: 'modules/banker/views/bankers.client.view.html'
    });
  }
]);
