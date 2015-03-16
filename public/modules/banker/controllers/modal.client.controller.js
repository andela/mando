      'use strict';

     //modal Controller
  angular.module('banker').controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'transaction', function($scope, $modalInstance, transaction){
    
    $scope.systemBalance = transaction;
    //$scope.withdraw = $scope.systemBalance;
    $scope.checkBalance = function () {
       if($scope.systemBalance < $scope.withdraw) {
           $scope.accountIsLower = true;
           $scope.message= true;
          }else {
            $scope.accountIsLower =false;
            $scope.message = false;
          }      
    };

    // $scope.withdraw = $scope.systemBalance;
      $scope.ok = function (amount) {
           $modalInstance.close(amount);
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
  }]);    
