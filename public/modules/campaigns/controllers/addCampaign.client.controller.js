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

   // if unauthenticated, go to home
    if (!$scope.authentication.user) {
      $location.path('/');
    }

    $scope.addCampaign = function() {
      $scope.campaign.youtubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.youtubeUrl);

        backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
          $location.path('/campaign/'+ data._id);
        })
        .error(function(error, status, header, config) {
          $scope.error = error;
        });
    };

    $scope.validateYoutubeUrl = function (url, isValid) {
      //checks if input is a valid url
      if(!isValid) {
        $scope.youtubeError = 'Please enter a valid youtube Url';
        return;
      }
      //get the youtube id from the url
      var youtubeId = youtubeEmbedUtils.getIdFromURL(url);
      //if the youtubeid is the same as url, then the user entered a wrong youtube url/id
      if(youtubeId === url) {
        $scope.youtubeError = 'Please enter a valid youtube URL';
        return;
      }
      backendService.checkYouTubeUrl(youtubeId)
        .success(function (result) {
          $scope.youtubeError = '';
          // Add campaign in youtube url is valid
        })
        .error(function (error){
          $scope.youtubeError = error;
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