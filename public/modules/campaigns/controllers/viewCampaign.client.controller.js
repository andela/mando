'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope', 'backendService', '$location', 'Authentication',
function($scope, backendService, $location, Authentication) {
  $scope.authentication = Authentication;
    $scope.campaign = {};

    if (!$scope.authentication.user) {
      $location.path('/');
    }
    $scope.viewCampaign = function() {
      backendService.viewCampaign($scope.campaign)
      .success(function(data, status, header, config) {
          console.log(data);
          $location.path('/campaign/'+ data._id);
        })
        .error(function(error, status, header, config) {
          console.log(error);
        });
    };
  }
]);