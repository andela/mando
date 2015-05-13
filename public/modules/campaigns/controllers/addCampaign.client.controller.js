'use strict';

/*global moment */

angular.module('campaign').controller('addCampaignCtrl', ['$scope', 'toaster', 'backendService', '$location', 'Authentication', 'youtubeEmbedUtils', '$state',
  function($scope, toaster, backendService, $location, Authentication, youtubeEmbedUtils, $state) {
    //provides the authentication object
    $scope.authentication = Authentication;
    $scope.campaign = {};

    //using moment.js to manipulate date
    $scope.minDate = moment().add(1, 'days');
    $scope.maxDate = moment().add(30, 'days');

    //if unauthenticated, go to home
    Authentication.requireLogin($state);

    $scope.addCampaign = function() {
      $scope.campaign.validYoutubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.validYoutubeUrl);
      backendService.addCampaign($scope.campaign)
        .success(function(data, status, header, config) {
          toaster.pop('success', $scope.campaign.title, 'Campaign created successfully');
          $location.path('/campaign/' + data.slug);
        })
        .error(function(error, status, header, config) {
          //no $scope.error on the view, need to work on the error
          $scope.error = error;
        });
    };

    $scope.validateYoutubeUrl = function(url, isValid) {
      //checks if input is a valid url
      if (!isValid) {
        $scope.youtubeError = 'Please enter a valid youtube Url';
        return;
      }
      //get the youtube id from the url
      var youtubeId = youtubeEmbedUtils.getIdFromURL(url);
      //if the youtubeid is the same as url, then the user entered a wrong youtube url/id
      if (youtubeId === url) {
        $scope.youtubeError = 'Please enter a valid youtube URL';
        return;
      }
      backendService.checkYouTubeUrl(youtubeId)
        .success(function(result) {
          $scope.youtubeError = '';
          // Add campaign in youtube url is valid
        })
        .error(function(error) {
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
