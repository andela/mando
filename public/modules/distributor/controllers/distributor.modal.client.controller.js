'use strict';

angular.module('distributor').controller('disModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

  $scope.ok = function (transaction) {
    console.log(transaction);
    $modalInstance.close(transaction);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);