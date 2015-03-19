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

    $scope.myInterval = 2000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'modules/core/img/app-images/caros1.jpg' + 'modules/core/img/app-images/andela.png' + 'modules/core/img/app-images/andela.png',
        text: ['Happy','Laugh','Honesty']
      });
    };
    for (var i=0; i<4; i++) {
    $scope.addSlide();
    }

	}
]);

// $scope.myInterval = 5000;
//   var slides = $scope.slides = [];
//   $scope.addSlide = function() {
//     var newWidth = 600 + slides.length + 1;
//     slides.push({
//       image: 'http://placekitten.com/' + newWidth + '/300',
//       text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
//         ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
//     });
//   };
//   for (var i=0; i<4; i++) {
//     $scope.addSlide();
//   }
// });