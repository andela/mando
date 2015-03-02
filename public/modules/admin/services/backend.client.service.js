'use strict';

angular.module('campaign').factory('adminBackendService', ['$http', function($http) {

  var getUsers = function() {
    return $http.get('/admin/users');
  };

  var addRolesToUser = function(data) {
    return $http.post('/admin/user/role/add', data);
  };

  return {
    getUsers: getUsers,
    addRolesToUser: addRolesToUser
  };
}]);