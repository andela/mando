      'use strict';

     //modal Controller
  angular.module('banker').controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'transaction', function($scope, $modalInstance, transaction){
    console.log(transaction);
    $scope.systemBalance = transaction;
    $scope.withdraw = $scope.systemBalance;
      $scope.ok = function (withdraw) {
           $modalInstance.close(withdraw);
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
  }]);    
