'use strict';
/*global Subledger*/
angular.module('banker').controller('transactionCtrl', ['$scope','Authentication','$http','$timeout','toaster','bankerConstant','$modal','bankerFactory', function($scope, Authentication, $http , $timeout,toaster,bankerConstant, $modal, bankerFactory){
  $scope.reports = [];
  $scope.withdrawal= {};
  $scope.balance = {
    bank_id: bankerConstant.BANK_ID,
    amount: ''
  };
  $scope.authentication = Authentication;
 // $scope.query = $scope.authentication.user.firstName;

  //Method to Get The Bank Balance
  $scope.getBalance = function(){ 
    var date = new Date().toISOString();
    bankerFactory.getSystemBalance($scope.balance.bank_id).balance({description: 'USD', at:date}, function(error, apiRes){
      if (error){
        console.log('im here');
        toaster.pop('error', 'An Error Occurred'+ error);
        return;
      }else{
        var amount = parseInt(apiRes.balance.value.amount);
        $scope.balance.amount = amount;
      }
    });
  };
  $scope.getBalance();

  //get All lines of transaction
 $scope.getJournals = function(){
  bankerFactory.getJournalReports($scope.balance.bank_id).get({
    'description': 'USD',
    'action': 'before',
    'effective_at': new Date().toISOString()
  }, function (error, apiRes){
    if(error){
      return error;
    }else {
       for(var i=0; i < apiRes.posted_lines.length; i++){
        try {
          var stringToObj = JSON.parse(apiRes.posted_lines[i].description);
          apiRes.posted_lines[i].description = stringToObj;
        } catch (e) {
          apiRes.posted_lines[i].description = {
            'name':'anonymous',
            'description':apiRes.posted_lines[i].description
          }; 
        }      
      }
     $scope.journal = apiRes.posted_lines;
     $scope.$digest();
   }
 });
};
  $scope.getJournals();
  

//Grab Some details of the Auhtenticated user and convert it to a string which will be stored in subledger the returned string is converted back into an object.

  $scope.withdrawFromBank = function (amount){
      var userToString = {
        name: $scope.authentication.user.displayName,
        email: $scope.authentication.user.email,
        description: 'Cash Withdrawal'
        };
      var userdetails =JSON.stringify(userToString);

    bankerFactory.createAndPostTransaction().createAndPost({
      'effective_at': new Date().toISOString(),
      'description': userdetails,
      'reference': 'http://andonation-mando.herokuapp.com/bank',
      'lines': [
      {
        'account': $scope.balance.bank_id,
        'description': userdetails,
        'reference':  'http://andonation-mando.herokuapp.com/bank',
        'value': {
          'type': 'debit',
          'amount': amount
        }
      },
      {
        'account': bankerConstant.SYSTEM_ID,
        'description': 'Cash Deposit',
        'reference':  'http://andonation-mando.herokuapp.com/bank',
        'value': {
          'type': 'credit',
          'amount': amount
        }
      }
      ]
    }, function (error, apiRes){
      if(error){
        return error;
      } else {
       var StringToObj = JSON.parse(apiRes.posting_journal_entry.description);
        $scope.getBalance();
        $scope.getJournals();
      }
    });
};

$scope.depositIntoBank = function (amount){
  var userToString = {
    name: $scope.authentication.user.displayName,
    email: $scope.authentication.user.email,
    description: 'Cash Deposit'
  };
  var userdetails =JSON.stringify(userToString);
 bankerFactory.createAndPostTransaction().createAndPost({
  'effective_at': new Date().toISOString(),
  'description': userdetails,
  'reference': 'http://andonation-mando.herokuapp.com/bank',
  'lines': [
  {
    'account': $scope.balance.bank_id,
    'description': userdetails,
    'reference':  'http://andonation-mando.herokuapp.com/bank',
    'value': {
      'type': 'credit',
      'amount': amount
    }
  },
  {
    'account': bankerConstant.SYSTEM_ID,
    'description': 'cash deposit',
    'reference':  'http://andonation-mando.herokuapp.com/bank',
    'value': {
      'type': 'debit',
      'amount': amount
    }
  }
  ]
  }, function (error, apiRes){
    if(error){
      return error;
    }
    else{
      $scope.getBalance();
      $scope.getJournals();
    }
  });
};
 // OPEN MODAL WINDOW
 $scope.openModalWithdraw = function(size){
  var modalInstance = $modal.open({
    templateUrl: 'modules/banker/views/withdraw.modal.view.html',
    controller : 'modalInstanceCtrl',
        size: size,
        resolve : {
          transaction: function(){
            return $scope.withdraw;
          }
        }
      });
  modalInstance.result.then(function (amount) {
   $scope.withdrawFromBank(amount);
        toaster.pop('success', 'Transaction Completed');
      });
};
  //OPEN MODAL WINDOW
  $scope.openModalDeposit = function(size){
    var modalInstance = $modal.open({
      templateUrl: 'modules/banker/views/deposit.modal.view.html',
      controller : 'modalInstanceCtrl',
      size: size,
      resolve : {
        transaction: function(){
          return $scope.deposit;
        }
      }
    });
    modalInstance.result.then(function (amount) {
      $scope.depositIntoBank(amount);
      toaster.pop('success', 'Transaction Completed');
      
    });
  };

}]);
