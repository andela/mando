'use strict';

angular.module('core').controller('HomeController', ['$scope', '$rootScope', 'Authentication', 'backendService',
	function($scope, $rootScope, Authentication, backendService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.campaigns = [];
    $scope.activeCampaigns = [];
    $scope.fundedCampaigns = [];
    backendService.getCampaigns()
      .success(function(data, status, header, config) {
        $scope.campaigns = data;
        angular.forEach($scope.campaigns, function(item) {
          var currentDate = new Date(Date.now());
          var campaignDeadline = new Date(item.dueDate);
          item.daysLeft = Math.ceil((campaignDeadline - currentDate)/(1000 * 3600 * 24));
          if(item.status === 'active') {
            $scope.activeCampaigns.push(item);
          }
          else if(item.status === 'funded') {
            $scope.fundedCampaigns.push(item);
          }
        });
      })
      .error(function(error, status, header, config) {
        $scope.error = error;
      });

      $scope.updateStatus = function(param) {
        $rootScope.currentStatus = param;
      };

    $scope.myInterval = 8000; 
    $scope.slides = [
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1430297767/caros3_tmgpvr.jpg',
        caption: 'All for one, One for all'
      },
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1430311270/carousel5_adruh8.jpg',
        caption: 'Donate and make a dream come true'
      },
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1430298374/caros4_jlfcl1.jpg',
        caption: 'Collaboration is the key to success'
      },
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1430297249/carousll_ijwwov.jpg',
        caption: 'Collaboration is the key to success'
      },
      {
        image: 'http://res.cloudinary.com/andela/image/upload/v1430321432/carousel5_shgamo.jpg',
        // image: 'http://res.cloudinary.com/andela/image/upload/v1430321967/caroue6_kx01ei.jpg',
        caption: 'Alone we can do so little, Together we can do so much'
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