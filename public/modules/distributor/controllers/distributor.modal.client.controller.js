'use strict';

angular.module('distributor').controller('disModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

  $scope.ok = function(transaction) {
    $modalInstance.close(transaction);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);
