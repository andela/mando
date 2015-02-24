'use strict';

angular.module('campaign').controller('editCampaignCtrl', ['$scope','backendService', '$location', 'Authentication','$stateParams','youtubeEmbedUtils', function ($scope, backendService, $location, Authentication, $stateParams, youtubeEmbedUtils) {
    $scope.Authentication = Authentication;
     $scope.campaign = {
        _id: $stateParams.campaignid
     };
   
    //route unauhenticated user  to the camapaign view page goes
    if(!$scope.Authentication.user){

        $location.path('/');
    }
    
    backendService.getCampaign($scope.campaign)
      .success(function(data, status){
        delete data.createdBy;
        $scope.campaign = data;
        $scope.campaign.youtubeUrl = 'https://www.youtube.com/watch?v='+data.youtubeUrl;
      })
      .error(function(err){
        //console.log(err);
    });

    $scope.editCampaign =function(){
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