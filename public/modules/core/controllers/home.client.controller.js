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

    $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1428678401/carousel1a_jt77zm.jpg'
      },
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1428678660/carousel2a_ksihkg.jpg'
      },
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1428678664/carousel3a_n0gkdj.jpg'
      },
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1428678401/carousel1a_jt77zm.jpg'
      }
    ];
	}
]);

angular.module('core').directive('disableAnimation', function($animate){
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs){
        $attrs.$observe('disableAnimation', function(value){
          $animate.enabled(!value, $element);
        });
      }
    };
});