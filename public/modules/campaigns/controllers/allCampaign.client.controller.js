'use strict';

angular.module('campaign').controller('allCampaignCtrl', ['$scope','$log', '$location','backendService', function ($scope, $location, $log, backendService) {

 $scope.totalItems = 1;

  backendService.getCampaigns()
  .success(function (data, status, header, config){
    $scope.campaigns = data;
    $scope.totalItems = data.length;
    $scope.filterCampaigns();
  })
  .error(function (error, status, header, config){
    console.log(error);
    });

  $scope.filterCampaigns = function () {
    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
    var end = begin + $scope.itemsPerPage;
    $scope.startItems = begin+1;
    // $scope.endItems = end < $scope.totalItems ? end : $scope.totalItems;
    if(end < $scope.totalItems){
      $scope.endItems = end;
    }else{
      $scope.endItems = $scope.totalItems;
    }

    $scope.Campaigns = $scope.campaigns.slice(begin, end);
  };

  $scope.currentPage = 1;
  $scope.itemsPerPage = 21;
  $scope.Campaigns = [];

  $scope.pageChanged = function() {
    console.log(10);
    $scope.filterCampaigns();
  };
  }
]);