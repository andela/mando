'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl',['$scope','$http','bankerFactory',function($scope, $http, bankerFactory){

$scope.balance = {
  bank_id: 'mnE22eIutb5SwDH69Ernfx',
  amount: ''
};
  bankerFactory.getSystemBalance($scope.balance.bank_id).balance({description: 'USD'}, function(error, apiRes){
        if (error){
          console.log(error);
        }else{
          console.log(3, apiRes);
          var amount = parseInt(apiRes.balance.value.amount);
          console.log(3, amount);
          //$scope.$digest();
          $scope.balance.amount = amount;
        }
      });

}]);
