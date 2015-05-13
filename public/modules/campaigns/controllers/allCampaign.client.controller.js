'use strict';

angular.module('campaign').controller('allCampaignCtrl', ['$scope', '$rootScope', '$location', 'backendService', 'currentStatus',  function($scope, $rootScope, $location, backendService, currentStatus) {
  $scope.selectedCampaigns = [];
  $scope.criteria = 'created';
  $scope.currentPage = 1;
  $scope.itemsPerPage = 21;
  $scope.totalItems = 1;
  $scope.activeStatus = $rootScope.currentStatus;

  $scope.init = function(campaignStatus) {
    backendService.getCampaigns()
      .success(function(data, status, header, config) {
        $scope.campaigns = data;
        $scope.selectedCampaigns = [];
        angular.forEach(data, function(item) {
          var currentDate = new Date(Date.now());
          var campaignDeadline = new Date(item.dueDate);
          item.daysLeft = Math.ceil((campaignDeadline - currentDate)/(1000 * 3600 * 24));
          if(item.status === campaignStatus) {
            $scope.selectedCampaigns.push(item);
          }
        });
        currentStatus.state = $rootScope.currentStatus;
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

  $scope.showSelected = function(state) {
    $scope.activeStatus = state;
    $rootScope.currentStatus = state; 
    $scope.selectedCampaigns = [];
    $scope.init($scope.activeStatus);
  };
  $scope.showSelected($rootScope.currentStatus || 'active' );
  $scope.init($rootScope.currentStatus || 'active');
}])
.factory('currentStatus', [function () {
  return {};
}]);
