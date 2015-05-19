'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', '$rootScope', '$http', '$log',
  function($scope, Authentication, $rootScope, $http,  $log) {
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

    $scope.signOut = function () {
      $log.log('siginOut');
      $http.get('/auth/signout').success(function(res){
        $scope.authentication = res;
      });
    };
  }
]);
