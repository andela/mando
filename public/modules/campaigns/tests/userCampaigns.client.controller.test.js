'use strict';

describe('userCampaignCtrl', function() {
  var userCampaignCtrl, userid, scope, $httpBackend, $stateParams;
  //Loading the main Application module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
    scope = $rootScope.new();
    $stateParams = _$stateParams_;
    $httpBackend = _$httpBackend_;
    userid = '54da2257568f9cfd6d2dba2f'

    userCampaignCtrl = $controller('userCampaignCtrl', {
      $scope: scope,
    });
  }));
  it('should return all campaigns created by a user', function() {
    $httpBackend.when('GET', '/campaigns/' + userid).respond(200, [
      {
    "_id" : ObjectId("54e4b7eba241567dbbec7122"),
    "lastModifiedBy" : "54da2257568f9cfd6d2dba2f",
}
      ])
  });
});