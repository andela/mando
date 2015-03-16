'use strict';

angular.module('campaign').controller('allCampaignCtrl', ['$scope', '$location', 'backendService', function($scope, $location, backendService) {
  $scope.Campaigns = [];
  $scope.criteria = 'created';
  $scope.currentPage = 1;
  $scope.itemsPerPage = 21;
  $scope.totalItems = 1;

  $scope.init = function() {
    backendService.getCampaigns()
      .success(function(data, status, header, config) {
        $scope.campaigns = data;
        $scope.totalItems = data.length;
        $scope.filterCampaigns();
      })
      .error(function(error, status, header, config) {
        return error;
      });
  };

  $scope.filterCampaigns = function() {
    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
    var end = begin + $scope.itemsPerPage;
    $scope.startItems = begin + 1;
    if (end < $scope.totalItems) {
      $scope.endItems = end;
    } else {
      $scope.endItems = $scope.totalItems;
    }
    $scope.Campaigns = $scope.campaigns.slice(begin, end);
  };

  $scope.pageChanged = function() {
    $scope.filterCampaigns();
  };
  $scope.init();
}]);
