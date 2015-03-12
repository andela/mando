'use strict';

describe('transactionCtrl', function(){
  var transactionCtrl, 
      $scope,
      $httpBackend,
      mockBankerService;

beforeEach(module(ApplicationConfiguration.applicationModuleName));

beforeEach(function(){
  mockBankerService = {
    getSystemBalance: function() {
      console.log('here');
      return {
        balance: function(e, cb){
            cb(null, {balance: {
              value: {
                amount: 100
                }
              }
            });
        }
       
      };

    },
    getJournalReports: function(){
      return {
        get: function(){}
      };
    }
  };
  module(function ($provide) {
    $provide.value('bankerFactory', mockBankerService);
  });
});
beforeEach(inject(function($controller, $rootScope, _$httpBackend_){
  $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    transactionCtrl = $controller('transactionCtrl', {$scope: $scope});
}));
  it('should show the current balance in the system', function(){
      $scope.getBalance();
      expect($scope.balance.amount).toBe(100);
  });
});

describe('transactionCtrl', function(){});