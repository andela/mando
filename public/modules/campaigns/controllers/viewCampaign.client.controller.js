'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope', 'backendService', '$location', 'Authentication', '$stateParams',
function($scope, backendService, $location, Authentication, $stateParams) {
  $scope.authentication = Authentication;
    if (!$scope.authentication.user || typeof $stateParams.campaignid !== 'number') {
      $location.path('/');
    }
    $scope.campaign = {
      _id: $stateParams.campaignid
    };

    backendService.getCampaign($scope.campaign)
    .success(function(data, status, header, config) {
      var youtube = data.youtubeUrl.split('watch?v=');
      if(youtube.length > 1){
         data.youtubeId = '//www.youtube.com/embed/'+youtube[1];
      }
      $scope.campaign = data;
      console.log(data);
      //$location.path('/campaign/'+ data._id);
    })
    .error(function(error, status, header, config) {
      console.log(error);
    });
  }
]);