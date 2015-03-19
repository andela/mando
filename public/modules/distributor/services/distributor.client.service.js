'use strict';
/*global Subledger*/

//This is just a repetition of the apis made in banker

angular.module('distributor').factory('distributorServices', ['$http', function($http) {
  var subledger = new Subledger();
  var cred = {};

  var setCredentials = function(data) {

    subledger.setCredentials(data.key_id, data.secret_id);
    cred = data;
    //subledger.setCredentials(key_id, secret);
  };

  var getAllUsers = function() {
    return $http.get('/distributor/users');
  };
  var getByUsername = function (username) {
    return $http.get('/distributor/getByUsername/'+username);
  };
  

  return {
    getAllUsers: getAllUsers,
    setCredentials: setCredentials,
    getByUsername: getByUsername
  };
}]);
