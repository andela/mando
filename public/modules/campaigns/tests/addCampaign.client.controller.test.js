'use strict';

describe('addCampaignCtrl', function() {

  var addCampaignCtrl,
      scope,
      $httpBackend,
      $stateParams,
      $location;

    //Loading the main Application module
beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, Authentication) {
    scope = $rootScope.$new();

    $stateParams = _$stateParams_;
    $httpBackend = _$httpBackend_;
    $location =  _$location_;
    Authentication.requireLogin = function($state, stateName) {};

    addCampaignCtrl= $controller('addCampaignCtrl', {
      $scope: scope,
      $location: $location
    });
    $httpBackend.whenGET('modules/campaigns/views/viewCampaign.client.view.html').respond(200);
    $httpBackend.whenGET('modules/core/views/home.client.view.html').respond(200);
    $httpBackend.whenGET('modules/core/views/home.client.view.html').respond(200);

  }));
//Authenticated user should be able to create a new campaign
  it('$scope.addCampaign should not create any campaign without the right credentials', function() {
    $httpBackend.when('POST', '/campaign/add').respond(400, {
      'message': 'Missing Credentials'
    });
    scope.campaign = {
      youtubeUrl: 'https://www.youtube.com/watch?v=9xFsYfYrQHQ'
    };
    scope.addCampaign();

    $httpBackend.flush();

    expect(scope.error.message).toEqual('Missing Credentials');
  });

  it('$scope.addCampaign should create a campaign with the right credentials', function() {
    $httpBackend.expectPOST('/campaign/add').respond({
      slug: '060151/latest-campaign'
    });

    scope.campaign = {
      description: 'A new Test is coming ehegefkgfkj',
      dueDate:'25-02-2015',
      amount: 1000,
      title: 'A new Test',
      youtubeUrl: 'https://www.youtube.com/watch?v=9xFsYfYrQHQ'
    };
    scope.addCampaign();

    $httpBackend.flush();

    expect($location.path()).toBe('/campaign/060151/latest-campaign');
  });
});
