'use strict';
describe('distributorCtrl', function() {
  var distributorCtrl,
    $scope,
    $httpBackend,
    $q,
    mockDistributorService;

  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$q_, Authentication) {
    $scope = $rootScope.$new();
    $q = _$q_;
    $httpBackend = _$httpBackend_;
    Authentication.user = {
      roles: 'distributor'
    };
    $httpBackend.when('GET', 'modules/core/views/home.client.view.html').respond(200);
    Authentication.requireLogin = function($state, stateName) {};
    Authentication.requireRole = function($state, role, stateName) {};
    Authentication.hasRole = function($state, role, stateName) {};
    distributorCtrl = $controller('distributorCtrl', {
      $scope: $scope,
      credentials: {
        data: {
          key_id: 'value22323',
          secret_id: 'a mock secret'
        }
      },
    });
  }));

  it('should load the total number of user in the system', function() {
    //returning a promise our expectation has to fall within the promise also.
    $httpBackend.when('GET', '/distributor/users').respond(200, [{
      'firstName': 'Abimbola'
    }]);
    $scope.getCurrentBalance = function() {};
    $scope.getUsers();
    $httpBackend.flush();
    expect($scope.users[0].firstName).toBe('Abimbola');
  });

});
