'use strict';

angular.module('distributor').controller('disModalInstanceCtrl', ['$scope', '$modalInstance','transaction', function($scope, $modalInstance, transaction) {

  $scope.ok = function (transaction) {
    $modalInstance.close(transaction.amount);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);