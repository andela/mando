'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl',['$scope','$http','toaster','bankerFactory',function($scope, $http,toaster, bankerFactory){

$scope.balance = {
  bank_id: 'mnE22eIutb5SwDH69Ernfx',
  amount: ''
};
var date = new Date().toISOString();

//console.log('THE DATE IS'+ date);
  bankerFactory.getSystemBalance($scope.balance.bank_id).balance({description: 'USD', at:date}, function(error, apiRes){
        if (error){
           toaster.pop('error', 'An Error Occurred'+ error);
           return;
        }else{
          var amount = parseInt(apiRes.balance.value.amount);
          $scope.balance.amount = amount;
          $scope.$digest();
        }
      });

}]);
