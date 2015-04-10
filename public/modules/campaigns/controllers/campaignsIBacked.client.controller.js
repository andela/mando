'use strict';

angular.module('campaign').controller('campaignsIBackedCtrl', ['$scope', 'backendService', 'ngTableParams', '$filter', 'subledgerServices', 'credentials', function ($scope, backendService, ngTableParams, $filter, subledgerServices, credentials) {

  var cred = credentials.data;
  subledgerServices.setCredentials(cred);

  backendService.campaignsIBacked().success(function (data) {
    $scope.campaignsBacked = data;
    for (var i = 0; i < data.length; i++) {
      $scope.getCampaignBalance(data[i].campaignid.account_id, $scope.campaignsBacked[i].campaignid);
    }
    $scope.tableParams = new ngTableParams({
      page: 1,
      count: data.length,
      sorting: {
        'title': 'asc'
      }
    }, {
      counts: [],
      total: data.length,
      getData: function ($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
          $filter('orderBy')(data, params.orderBy()) : data;
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  });
  $scope.getCampaignBalance = function (account, destination) {
    subledgerServices.getBalance(account, function (response) {
      destination.raised = response;
      $scope.$digest();
    });
  };

}]);

