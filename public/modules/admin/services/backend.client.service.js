'use strict';

angular.module('campaign').factory('adminBackendService', ['$http', function($http) {

  var getUsers = function() {
    return $http.get('/admin/users');
  };

  var updateUserRoles = function(data) {
    return $http.post('/admin/user/roles/edit', data);
  };

  return {
    getUsers: getUsers,
    updateUserRoles: updateUserRoles
  };
}]);