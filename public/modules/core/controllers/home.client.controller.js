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
          if(item.status === 'active') {
            $scope.activeCampaigns.push(item);
          }
          else if(item.status === 'funded') {
            $scope.fundedCampaigns.push(item);
          }
        })
      })
      .error(function(error, status, header, config) {
        $scope.error = error;
      });

      $scope.updateStatus = function() {
        $rootScope.currentStatus = 'funded';
      };

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