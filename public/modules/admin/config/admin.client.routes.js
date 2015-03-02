'use strict';

angular.module('admin').config(['$stateProvider',function($stateProvider) {

  $stateProvider.
    state('allUsers', {
      url: '/admin/users',
      templateUrl: 'modules/admin/views/users.admin.client.view.html'
    });
}]);
