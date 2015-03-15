'use strict';

/*global moment */
angular.module('campaign').controller('editCampaignCtrl', ['$scope','toaster', 'backendService', '$location', 'Authentication','$stateParams','youtubeEmbedUtils', function ($scope,toaster, backendService, $location, Authentication, $stateParams, youtubeEmbedUtils) {
    $scope.authentication = Authentication;

    if(!$scope.authentication.user){
        $location.path('/');
    }
  $scope.getCampaign = function (){
    backendService.getCampaign($stateParams.campaignTimestamp + '/' + $stateParams.campaignslug)
      .success(function(data, status){
        if($scope.authentication.user._id !== data.createdBy._id){
          $location.path('/campaign/'+ data.slug);
        }
        //The Date of Campaign cannot exceed 30 days of the date it was created
        $scope.minDate = moment(data.created);
        $scope.maxDate = moment(data.created).add(30, 'days');
        $scope.campaign = data;
        $scope.campaign.youtubeUrl = 'https://www.youtube.com/watch?v='+data.youtubeUrl;
      })
      .error(function(err){
        toaster.pop('error', 'An Error Occurred'+ err);
      });
    };
  $scope.getCampaign();
    $scope.editCampaign = function(){
      delete $scope.campaign.createdBy;
      delete $scope.campaign.created;
      $scope.campaign.youtubeUrl = youtubeEmbedUtils.getIdFromURL($scope.campaign.youtubeUrl);
      backendService.updateCampaign($scope.campaign)
        .success(function(data, status, header, config){
          toaster.pop('success', 'Campaign Edited Successfully');
          $location.path('/campaign/' + data.slug);
        })
        .error(function(err,status, header, config){
          $scope.error = err;
          toaster.pop('error','An Error Occurred:'+ err);
        });
    };

    $scope.validateYoutubeUrl = function (url) {
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

    $scope.deleteCampaign = function(data, toastr) {
       var confirmMsg = confirm('Do you want to delete this Campaign?');
      if(confirmMsg) {
          backendService.deleteCampaign($scope.campaign._id).success(function(text) {
          toaster.pop('success', $scope.campaign.title, 'Campaign deleted successfully');
          $location.path('/campaigns/myAndonation');
          }).error(function(error) {
            //do a more comprehensive error checking
        });
      }

  };

    //Open the Calendar
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  }
]);