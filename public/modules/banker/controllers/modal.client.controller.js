'use strict';

//modal Controller
angular.module('banker').controller('withdrawalModalInstanceCtrl', ['$scope', '$modalInstance', 'transaction', function($scope, $modalInstance, transaction) {
  $scope.withdraw = 0;
  $scope.systemBalance = transaction;
  $scope.checkBalance = function() {
    if ($scope.systemBalance < $scope.withdraw) {
      $scope.accountIsLower = true;
      $scope.message = true;
    } else {
      $scope.accountIsLower = false;
      $scope.message = false;
    }
  };
  $scope.ok = function(amount) {
    $modalInstance.close(amount);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);

angular.module('banker').controller('depositModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
  $scope.deposit = 0;
  $scope.ok = function(amount) {
    $modalInstance.close(amount);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);
