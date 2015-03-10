'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl',['$scope','$http','toaster','$modal','bankerFactory',function($scope, $http,toaster, $modal, bankerFactory){
  $scope.reports = [];
  $scope.withdrawal= {};
  $scope.balance = {
    bank_id: '6HNEAjoyxWtXjVXD2TyZqE',
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

$scope.withdrawFromBank = function (){
 var amount = $scope.withdrawal.amount;
 console.log('here', amount);
  bankerFactory.createAndPostTransaction().createAndPost({
    'effective_at': new Date().toISOString(),
    'description': 'withdrawal',
    'reference': 'http://andonation-mando.herokuapp.com/bank',
    'lines': [
    {
      'account': $scope.balance.bank_id,
      'description': 'cash withdrawal',
      'reference':  'http://andonation-mando.herokuapp.com/bank',
      'value': {
        'type': 'debit',
        'amount': amount
      }
    },
    // {$scope.system_balance_id
    {
      'account': 'E8GtyKhrPjSduG8aHSUusc',
      'description': 'cash deposit',
      'reference':  'http://andonation-mando.herokuapp.com/bank',
      'value': {
        'type': 'credit',
        'amount': amount
      }
    }
    ]
  }, function (error, apiRes){
    if(error){
      console.log(error);
    }
    else{
      //toaster.pop('success', amount +'was  Withdrawn Succesfully');
    //$scope.digest($scope.balance);
    $scope.$digest();
  }
});
};
  //get All lines of transaction
  bankerFactory.getJournalReports($scope.balance.bank_id).get({
    'description': 'USD',
    'action': 'before',
    'effective_at': new Date().toISOString()
  }, function (error, apiRes){
    if(error){
      return error;
    }else {
     // toaster.pop('success', 'Loading Transaction Details');
      $scope.journal = apiRes.posted_lines;
      $scope.$digest();
    }
  });

  //get All banking Reports 
  bankerFactory.getReports().get({
    'description': 'USD', 
    'state': 'active',
    'action': 'before',

  },function (error,apiRes){
    if(error){
      return error;
    }else {
      $scope.reports = apiRes;
      $scope.$digest();
    }
    
  });

  //OPEN MODAL WINDOW
  
  // $scope.openModal = function(size){
  //   var modalInstance = $modal.open({
  //     templateUrl: 'modules/banker/views/support.modal.view.html',
  //     controller : function ($scope, $modalInstance){
  //   //  $scope.authentication = Authentication;

  //     $scope.ok = function () {
  //       $modalInstance.close($scope.amount);
  //     };
  //     $scope.cancel = function () {
  //       $modalInstance.dismiss('cancel');
  //     };
  //     },
  //     size: size,
  //     });
  //     modalInstance.result().then(function () {
  //     console.log();

  //   });
  //  };
 }]);
