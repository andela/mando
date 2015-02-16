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
      $scope: scope,
      $location: $location
    });

  }));
//Authenticated user should be able to create a new campaign
  it('$scope.addCampaign should not create any campaign without the right credentials', function() {
    $httpBackend.when('POST', '/campaign/add').respond(400, {
      'message': 'Missing Credentials'
    });
    scope.addCampaign();

    $httpBackend.flush();

    expect(scope.error.message).toEqual('Missing Credentials');
  });

  it('$scope.addCampaign should create a campaign with the right credentials', function() {
    $httpBackend.expectPOST('/campaign/add').respond({
      _id: "54e2236b7146262c2c67423e"
    });

    scope.campaign = {
      description: 'A new Test is coming ehegefkgfkj',
      dueDate:'25-02-2015',
      amount: 1000,
      title: 'A new Test',
      youtubeUrl: 'http://andela.co'
    };
    scope.addCampaign();

    $httpBackend.flush();

    expect($location.path()).toBe('/campaign/54e2236b7146262c2c67423e');
  });
});

// Ah okay, it's a little more complicated, because the only thing we know outside of the scope is that the location.path changed, but in angular tests $Location has very few properties and it's just a mock object, what I would do is write an e2e test for this to check that it creates the campaign and navigates to the right page
//what if we decide to send a a status response e.g expect(status)toBe(200) kind of thing?
// well right now we are sending back a 200 with an empty object..
//but the location.path() is still undefined
// no $location.path() is /campaign/undefined, which means data._id is undefined.

//yes
//so do you want to  test something on The 
//Yes can you make a new campaign and I want
//to see what datais logged as

//so now we should see that location.path() is correct with an id, because we added that to the HTTP response from the mocked server in this test. So instead of testing the ddata, I tested the $location change. I don't think you need an e2e test, but it couldn't hurt if you had issues with this functionality to add one in to be sure.

//So we are mocking a path for the test? jjust to ensure that the url changes right?
//Correct

//comparing this and an e2e test which do you think is an ideal test for this 
// well right now we are still testing the functionality, but if in the future you add more functionality that cannot be broken down into multiple steps, then an e2e test is a good idea. This one is just 1 step, so it can be tested just fine with a unit test.

//okay
// so moving forward now i do i get the best of writing unit test?
// in most cases a unit test should cover everything, but say I have functionality like the OAuth login, that would be a good idea for an e2e test.

