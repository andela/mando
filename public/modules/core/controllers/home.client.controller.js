'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'backendService',
	function($scope, Authentication, backendService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.campaigns = [];

    backendService.getCampaigns()
      .success(function(data, status, header, config) {
        $scope.campaigns = data;
      })
      .error(function(error, status, header, config) {
        $scope.error = error;
      });
	}
]);