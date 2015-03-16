'use strict';

angular.module('distributor').controller('disModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

  $scope.ok = function (amount) {
    $modalInstance.close(amount);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);