'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl',['$scope','$http','toaster','bankerFactory',function($scope, $http,toaster, bankerFactory){
$scope.reports = [];
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

// //debtor and creditor 
// var InitiateTransaction = function(){
//   var params = {
//   'effective_at': new Date().toISOString(),
//   'description': $scope.description,
//   'reference': 'http://andela.co',
//   'lines': [
//       {
//       'account': $scope.account_id, //debtor
//       'description': $scope.descrition,
//       'reference': 'http://andela.co',
//        'value': {
//          'type': 'debit',
//          'amount': $scope.amount
//          }
//       },
//      {
//       'account': $scope.account_id, //creditor
//       'description':$scope.description,
//       'reference': 'http://andela.co',
//        'value': {
//          'type': 'credit',
//          'amount': $scope.amount
//         }
//       }
//     ]
//   };
  

//   bankerFactory.createAndPostTransaction().createAndPost({params:params}, function(error, apiRes){
//     if(error){
//       return error;
//     } else {
//       console.log('createAndPost'+ apiRes);
//     }
//   });

// };
  //get All lines of transaction
  bankerFactory.getJournalReports($scope.balance.bank_id).get({
    'description': 'USD',
    'action': 'before',
    'effective_at': new Date().toISOString()
  }, function (error, apiRes){
      if(error){
          return error;
      }else {
      $scope.journal = apiRes.posted_lines;
      toaster.pop('success', 'Loading Transaction Details');
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

  //  bankerFactory

}]);
