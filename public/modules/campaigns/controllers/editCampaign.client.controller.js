'use strict';

/*global moment */
angular.module('campaign').controller('editCampaignCtrl', ['$scope','backendService', '$location', 'Authentication','$stateParams','youtubeEmbedUtils', function ($scope, backendService, $location, Authentication, $stateParams, youtubeEmbedUtils) {
    $scope.authentication = Authentication;

    if(!$scope.authentication.user){
        $location.path('/');
    }

     $scope.campaign = {
        _id: $stateParams.campaignid
     };
    //authentication.user._id === campaign.createdBy._id
    backendService.getCampaign($scope.campaign)
      .success(function(data, status){
        if($scope.authentication.user._id !== data.createdBy._id){
          $location.path('/campaign/'+ data._id);
        }
        $scope.maxDate = data.dueDate;
        $scope.campaign = data;
        $scope.campaign.youtubeUrl = 'https://www.youtube.com/watch?v='+data.youtubeUrl;
      })
      .error(function(err){
        //console.log(err);
    });

    $scope.editCampaign =function(){
    delete $scope.campaign.createdBy;
    $scope.campaign.youtubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.youtubeUrl);
      backendService.updateCampaign($scope.campaign)
      .success(function(data, status, header, config){
        $location.path('/campaign/' + data._id);
      })
      .error(function(err,status, header, config){
        $scope.error = err;
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

//Open the Calendar
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  }
]);