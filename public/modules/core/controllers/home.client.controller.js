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
      image: 'http://res.cloudinary.com/andela/image/upload/v1427207822/caros3_lnwm8z.jpg'
    },
    {
      image: 'http://res.cloudinary.com/andela/image/upload/v1427278895/caros6_lujtxb.jpg'
    },
    {
      image: 'http://res.cloudinary.com/andela/image/upload/v1427279010/caros7_xvgevw.jpg'
    },
    {
      image: 'http://res.cloudinary.com/andela/image/upload/v1427279114/caros8_detjfr.jpg'
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