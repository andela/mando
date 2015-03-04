'use strict';

angular.module('campaign').controller('viewCampaignCtrl', ['$scope','toaster' , 'backendService','$location', 'Authentication', '$stateParams',
function($scope, toaster, backendService,$location, Authentication, $stateParams) {
  $scope.authentication = Authentication;

  backendService.getCampaign($stateParams.campaignTimeStamp + '/' + $stateParams.campaignslug)
  .success(function(data, status, header, config) {
    console.log(data);
    $scope.campaign = data;
  })
  .error(function(error, status, header, config) {
    console.log(error);
    $location.path('/');
  });
}]);