'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication',
  function($scope, Authentication) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
  console.log($scope.authentication.user.providerData);
    $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
    }
]);