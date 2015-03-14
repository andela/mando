'use strict';

angular.module('distributor').controller('distributorCtrl', ['$scope', 'Authentication','distributorService', '$location', '$state', '$modal', 'toaster', function($scope, Authentication, distributorService, $location, $state, $modal, toaster) {

  $scope.account_id = Authentication.user.account_id;

   $scope.authentication = Authentication;

  Authentication.requireLogin($state);

  Authentication.requireRole($state, 'distributor', 'userCampaigns');

  distributorService.getAllUsers().success(function(data) {
    $scope.users = data;
  }).error(function(error) {
    $scope.error = error;
  });

  $scope.getUserAccountBalance = function() {

  };


  $scope.distributorModal = function() {
    var modalInstance = $modal.open({
        templateUrl: 'modules/distributor/views/distributor.modal.client.view.html',
        controller: 'disModalInstanceCtrl',
        size: 'sm',
      });
  };

  $scope.creditUserAccount = function() {
    console.log('credited');
  };
}]);