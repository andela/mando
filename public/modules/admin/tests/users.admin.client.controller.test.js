// 'use strict';

// describe('adminUserCtrl', function() {
//   var adminUserCtrl, scope, $httpBackend;
//   //loading the main Application module
//   //should refactor all beforeEach to a file
//   beforeEach(module(ApplicationConfiguration.applicationModuleName));
//   beforeEach(inject(function($controller, $rootScope, _$httpBackend_, Authentication) {
//     scope = $rootScope.$new();
//     Authentication.user = {
//       '_id': '54da2257568f9cfd6d2dba2f',
//       roles: [{
//         roleType: 'admin'
//       }]
//     };
//     $httpBackend = _$httpBackend_;
//     $httpBackend.whenGET('/admin/users').respond(200, [
//       {
//         '_id' : '54e4b7eba241567dbbec7122',
//         'lastModifiedBy' : '54da2257568f9cfd6d2dba2f',
//       },
//       {
//         '_id' : '54e4b7eba241567dbbec7122',
//         'lastModifiedBy' : '54da2257568f9cfd6d2dba2f',
//       }]);
//     // $httpBackend.whenGET('modules/core/views/home.client.view.html').respond(200, 'home page');
//     adminUserCtrl = $controller('adminUserCtrl', {
//       $scope: scope
//     });
//   }));
//   it('should return all users in the system', function() {
//     console.log(1, scope.users);
//     $httpBackend.flush();
//     expect(scope.users).toBeDefined();
//     expect(scope.users.length).toBeGreaterThan(1);
//   });
// });