// 'use strict';
// angular.module('banker').factory('bankerFactory', [ 'BANKERCONST',
//   '$http', function(BANKERCONST, $http) {

//     var url = 'https://api.subledger.com/v2/';
//     var org_id = 'EpXxbhcVpxyC8BH0icuIQF';
//     var book_id = 'R6WkhSAmw4STDyGHbrrFJL';

//   //Get the Balance of the bankker from his subledger account.
//   var getBankBalance = function(){
//     var req = {
//      method: 'GET',
//      url: url+'/org_id/'+org_id+'/book_id/'+book_id,
//      headers: {
//        'Content-Type': 'application/json',
//        'key-id':'2lzQysbyNXhPgYxx8pp2vE',
//        'secret-key':'CJzZPwRw01thgquyeD6RYc'
//      },
//    //  data: {},
//    };


//     return $http(req).success(function(data, error, headers, config){
//       console.log(1, data);
//       return data;

//     }).error(function(data, error, headers, config){
//       console.log(2, error);
//     });    
//   };
//    //the Http request for the  entire Organisation banker with a get request

//   // var getUniqueBankerTransaction = function(bankderId){
//   //   return; // the http return transaction details/history for the banker 
//   // };

// }
// ]);

// // // send some combined key+secret combination
// // // use the response and modify it in some way
// // // attach that key to the API request that you want to make

// // // page -> navigation bar + content -> campaign + if banker show bank module