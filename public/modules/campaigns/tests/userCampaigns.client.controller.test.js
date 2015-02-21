'use strict';

describe('userCampaignsCtrl', function() {
  var userCampaignsCtrl, scope, userid, $httpBackend;
  //Loading the main Application module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, Authentication) {
    scope = $rootScope.$new();
    Authentication.user = {
        _id: '54da2257568f9cfd6d2dba2f'
    };
    userid = '54da2257568f9cfd6d2dba2f';
    $httpBackend = _$httpBackend_;
    userCampaignsCtrl = $controller('userCampaignsCtrl', {
      $scope: scope,
    });
  }));
  it('should return all campaigns created by a user', function() {
    $httpBackend.when('GET', '/campaigns/' + userid).respond(200, {
        '_id' : '54e4b7eba241567dbbec7122',
        'lastModifiedBy' : '54da2257568f9cfd6d2dba2f',
      }
    );
    console.log(scope.myCampaigns);
    $httpBackend.flush();
    console.log(scope.myCampaigns);
    expect(typeof scope.myCampaigns).toBe('object');
  });
});