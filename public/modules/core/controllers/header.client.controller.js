'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication',
  function($scope, Authentication) {
    $scope.authentication = Authentication;
  }
]);