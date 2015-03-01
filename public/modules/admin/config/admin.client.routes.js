'use strict';

angular.module('admin').config(['$stateProvider',function($stateProvider) {

  $stateProvider.
    state('allUsers', {
      url: '/admina/users',
      templateUrl: 'modules/admin/views/users.admin.client.view.html'
    });
}]);
