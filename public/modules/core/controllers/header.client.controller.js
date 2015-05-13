'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', '$rootScope',
  function($scope, Authentication, $rootScope) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;

    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
    });

    $scope.showActiveCampaigns = function (param) {
        $rootScope.currentStatus = param;
    };
  }
]);
