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