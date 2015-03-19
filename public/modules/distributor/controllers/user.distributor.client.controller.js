'use strict';

angular.module('distributor').controller('userDistributionCtrl', ['$scope', '$http', 'Authentication', 'toaster','subledgerServices','distributorServices','$stateParams','credentials', '$state', function($scope, $http, Authentication, toaster, subledgerServices, distributorServices , $stateParams, credentials, $state) {
  $scope.user = {};
  $scope.journal = [];

  var username = $stateParams.username;
  $scope.authentication = Authentication;
  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'banker', 'userCampaigns');
  $scope.isDistributor = Authentication.hasRole('distributor');
  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  var getByUsername = (function (username) {
    distributorServices.getByUsername(username).success(function (data, status, header, config){

      $scope.getJournals(data.account_id);

    })
    .error(function (error,status, header, config){
      console.log(error);
    });
  })(username);

  //get All lines of transaction
  $scope.getJournals = function(account) {
    subledgerServices.getJournals(account, function(response) {
      $scope.journal = response.posted_lines;
      $scope.$digest();
      console.log($scope.journal);
    });
  };

}]);

