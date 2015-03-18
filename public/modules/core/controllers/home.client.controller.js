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

 //    $scope.myInterval = 5000;
 //    var slides = $scope.slides = [];
 //    $scope.addSlide = function() {
 //      slides.push({
 //        image: 'https://pbs.twimg.com/media/BrMIOefCYAAj8ez.jpg:large',
 //        text: 'Happy'
 //      });
 //    };
 //    for (var i=0; i<4; i++) {
 //    $scope.addSlide();
 //    }
	}
]);