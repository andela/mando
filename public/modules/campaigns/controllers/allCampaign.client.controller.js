'use strict';

angular.module('campaign').controller('allCampaignCtrl', ['$scope','$location','backendService', function ($scope, $location, backendService) {

  backendService.getCampaigns()
  .success(function (data, status, header, config){
    
    $scope.campaigns = data;
  })
  .error(function (error, status, header, config){
    console.log(error);
    });

  }
]);
