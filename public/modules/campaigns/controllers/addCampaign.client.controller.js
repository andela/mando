'use strict';

/*global moment */



angular.module('campaign').controller('addCampaignCtrl', ['$scope', 'backendService',  '$location','Authentication',
  function($scope, backendService, $location, Authentication) {
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
      console.log('adding');
      console.log($scope.campaign);
      var youtube = $scope.campaign.youtubeUrl.split('watch?v=');
      var youtubeId = null;
      if(youtube.length > 1){
         youtubeId = youtube[1];
      }

      // backendService.checkYouTubeUrl(youtubeId)
      // .success(function (result) {
      //   $scope.youtubeError = '';
        // Add campaign in youtube url is valid
        // console.log(result);
        backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
          console.log(data);
          $location.path('/campaign/'+ data._id);
        })
        .error(function(error, status, header, config) {
          console.log(error);
          $scope.error = error;
        });
      // });
      // .error(function (error){
      //   $scope.youtubeError = error;
        //console.log('Invalid YouTube video');
      // });
    };

    $scope.validateYoutubeUrl = function (url) {
      // console.log('checking');youtubeError
      var youtube = $scope.campaign.youtubeUrl.split('watch?v=');
      var youtubeId = null;
      if(youtube.length > 1){
         youtubeId = youtube[1];
      }
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