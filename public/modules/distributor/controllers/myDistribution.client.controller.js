'use strict';
angular.module('distributor').controller('myDistribution', ['$scope', '$http', 'Authentication', '$state', 'subledgerServices', 'credentials', function($scope, $http, Authentication, $state, subledgerServices, credentials) {
  $scope.distribution = [];
  $scope.authentication = Authentication;
  $scope.query = $scope.authentication.user.displayName;
  $scope.isDistributor = Authentication.hasRole('distributor');

  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  subledgerServices.setCredentials(cred);


  Authentication.requireLogin($state);
  Authentication.requireRole($state, 'distributor');

  var getDistributionJournal = function(accountId) {
    subledgerServices.getJournals(accountId, function(response) {
      $scope.distribution = response.posted_lines;
      $scope.$digest();
    });
  };

  getDistributionJournal(cred.bank_id);
}]);
