'use strict';

angular.module('distributor').controller('userDistributionCtrl', ['$scope', '$http', 'Authentication', 'toaster','subledgerServices','distributorServices','$stateParams', function($scope, $http, Authentication, toaster, subledgerServices, distributorServices , $stateParams) {

  var username = $stateParams.username;
  $scope.authentication = Authentication;
  Authentication.hasRole('distributor');

  // $scope.getJournals = function(account) {
  //   subledgerServices.getJournals(account, function(response) {
  //     $scope.journal = response.posted_lines;
  //      $scope.$digest();
  //   });
  // };
  // $scope.getJournals();

  var getByUsername = (function (username) {
    distributorServices.getByUsername(username).success(function (data, status, header, config){
      console.log(data);
    })
    .error(function (error,status, header, config){
      console.log(error);
    });
  })(username);
}]);

