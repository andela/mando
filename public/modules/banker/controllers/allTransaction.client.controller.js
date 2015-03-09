'use strict';

angular.module('banker').controller('transactionCtrl',['$scope','$http', function($scope, $http){
$scope.balance = {
  all: 1000
};
    var url = 'https://api.subledger.com/v2/';
    var org_id = 'EpXxbhcVpxyC8BH0icuIQF';
    var book_id = 'R6WkhSAmw4STDyGHbrrFJL';

var myBalance = function(){
  console.log('myBalance');
  //   var req = {
  //    method: 'GET',
  //    url: url+'/org_id/'+org_id+'/book_id/'+book_id,
  //    headers: {
  //      'Content-Type': 'application/json',
  //      'key-id':'2lzQysbyNXhPgYxx8pp2vE',
  //      'secret-key':'CJzZPwRw01thgquyeD6RYc'
  //    },
  //  //  data: {},
  //  };
  //  $http(req).success(function(data, error, headers, config){
  //     console.log(1, data);
  //      $scope.balance = data;
  //      return $scope.balance
  //   }).error(function(data, error, headers, config){
  //     console.log(2, error);
  //   });    
  };

}]);
