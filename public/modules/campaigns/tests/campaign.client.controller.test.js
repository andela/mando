'use strict';

describe('addCampaignCtrl', function() {

  var addCampaignCtrl,
      scope,
      $httpBackend,
      $stateParams,
      $location;

    //Loading the main Application module
beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
    scope = $rootScope.$new();

    $stateParams = _$stateParams_;
    $httpBackend = _$httpBackend_;
    $location =  _$location_;

    addCampaignCtrl= $controller('addCampaignCtrl', {
      $scope: scope
    });

  }));
//Authenticated user should be able to create a new campaign
  it('$scope.addCampaign should not create any campaign wihtout the right credentials', function() {
    $httpBackend.when('POST', '/campaign/add').respond(400, {
      'message': 'Missing Credentials'
    });
    scope.addCampaign();

    $httpBackend.flush();

    expect(scope.error.message).toEqual('Missing Credentials');
  });
});