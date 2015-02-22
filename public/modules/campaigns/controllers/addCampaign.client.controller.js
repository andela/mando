'use strict';

/*global moment */



angular.module('campaign').controller('addCampaignCtrl', ['$scope', 'backendService',  '$location','Authentication', 'youtubeEmbedUtils',
  function($scope, backendService, $location, Authentication, youtubeEmbedUtils) {
    //provides the authentication object
    $scope.authentication = Authentication;
    $scope.campaign = {};

    //using moment.js to manipulate date
    $scope.minDate = moment().add(1, 'days');
    $scope.maxDate = moment().add(30, 'days');

    // console.log(1, backendService);

   // if unauthenticated, go to home
    if (!$scope.authentication.user) {
      $location.path('/');
    }

    $scope.addCampaign = function() {
      var youtube = $scope.campaign.youtubeUrl.split('watch?v=');
      var youtubeId = null;
      if(youtube.length > 1){
         youtubeId = youtube[1];
      }

        backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
          $location.path('/campaign/'+ data._id);
        })
        .error(function(error, status, header, config) {
          $scope.error = error;
        });
    };

    $scope.validateYoutubeUrl = function (url) {
      var youtubeId = youtubeEmbedUtils.getIdFromURL(url);
      console.log(youtubeId);
      backendService.checkYouTubeUrl(youtubeId)
        .success(function (result) {
          $scope.youtubeError = '';
          // Add campaign in youtube url is valid
          console.log(result);
        })
        .error(function (error){
          $scope.youtubeError = error;
          console.log(error);
          //console.log('Invalid YouTube video');
        });
    };

    //to open the calendar
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  }
]);