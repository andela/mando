'use strict';

describe('transactionCtrl', function(){
  var transactionCtrl, 
      $scope,
      $httpBackend;

beforeEach(module(ApplicationConfiguration.applicationModuleName));

beforeEach(inject(function($controller,$rootScope, _$location_, _$httpBackend_){
  $scope = $rootScope.new();
    $httpBackend = _$httpBackend_;
    transactionCtrl = $controller('transactionCtrl');
}));


});