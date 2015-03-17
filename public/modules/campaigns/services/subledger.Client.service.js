// 'use strict';
// /*global Subledger*/
// angular.module('campaign').factory('SubledgerServices', ['$http', function($http) {
//   var subledger = new Subledger();
//   var credentials = {};
//   var cred = {};

//   var setCredentials = function(data) {
//     subledger.setCredentials(data.key_id, data.secret_id);
//     cred = data;

//   };

//   var getJournalReports = function(org_id, book_id, account) {
//     return subledger.organization(org_id).book(book_id).account(account).line();
//   };

//   var getJournals = function(output, account, cb) {
//     getJournalReports(cred.org_id, cred.book_id, account).get({
//       'description': 'USD',
//       'action': 'before',
//       'effective_at': new Date().toISOString()
//     }, function(error, apiRes) {
//       if (error) {
//         return error;
//       } else {
//         for (var i = 0; i < apiRes.posted_lines.length; i++) {
//           try {
//             var stringToObj = JSON.parse(apiRes.posted_lines[i].description);
//             apiRes.posted_lines[i].description = stringToObj;
//           } catch (e) {
//             apiRes.posted_lines[i].description = {
//               'name': 'anonymous',
//               'description': apiRes.posted_lines[i].description
//             };
//           }
//         }
//         output = apiRes.posted_lines;
//      //   $scope.$digest();
//         if (!!cb) {
//           cb();
//         }
//       }
//     });
//   };


//   return {
//     getJournalReports: getJournalReports,
//     getJournals: getJournals
//   };
// }]);
