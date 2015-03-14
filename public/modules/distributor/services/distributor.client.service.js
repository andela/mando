'use strict';

angular.module('distributor').factory('distributorService', ['$http', function($http) {

  var getAllUsers = function() {
    return $http.get('/distributor/users');
  };
  return {
    getAllUsers: getAllUsers
  };
}]);