'use strict';

angular.module('campaign').controller('addCampaignCtrl', ['$scope', 'backendService',  '$location','Authentication',
  function($scope, backendService, $location, Authentication) {
    //provides the authentication object
    $scope.authentication = Authentication;
    $scope.campaign = {};
    // console.log(1, backendService);
   // if unauthenticated, go to home
    if (!$scope.authentication.user) {
      $location.path('/');
    }
    function _convertToEmbedUrl(url){
      return url.replace('watch','embed');

    }
    $scope.addCampaign = function() {
      $scope.campaign.youtubeUrl = _convertToEmbedUrl($scope.campaign.youtubeUrl);
      console.log($scope.campaign.youtubeUrl);
      backendService.addCampaign($scope.campaign)
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
