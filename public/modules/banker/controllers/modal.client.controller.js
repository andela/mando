      'use strict';

     //modal Controller
  angular.module('banker').controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'transaction', function($scope, $modalInstance, transaction){
    
    $scope.systemBalance = transaction;
    //$scope.withdraw = $scope.systemBalance;
    $scope.checkBalance = function () {
       if($scope.systemBalance < $scope.withdraw) {
           $scope.accountIsLower = true;
           $scope.message= 'You cannot withdraw beyond your current balance';
          }      
    };

    // $scope.withdraw = $scope.systemBalance;
      $scope.ok = function (withdraw) {
           $modalInstance.close(withdraw);
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
  }]);    
