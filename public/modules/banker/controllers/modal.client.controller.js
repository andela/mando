      'use strict';

     //modal Controller
  angular.module('banker').controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'transaction', function($scope, $modalInstance, transaction){
      $scope.ok = function (transaction) {
           $modalInstance.close(transaction.amount);
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
  }]);    
