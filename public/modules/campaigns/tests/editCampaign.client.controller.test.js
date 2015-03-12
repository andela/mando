'use strict';

describe('editCampaignCtrl', function() {

  var editCampaignCtrl,
      scope,
      $httpBackend,
      $stateParams,
      $location;

    //Loading the main Application module
beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $location =  _$location_;

    editCampaignCtrl= $controller('editCampaignCtrl', {
      $scope: scope,
      $location: $location
    });
  }));

    it('should be able to edit a campaign successfully', function(){
        $httpBackend.expectPOST('/campaign/54e2236b7146262c2c67423e/edit').respond( 200, {'message' : 'Edited successfully'});
        
        scope.campaign = {
          title : 'Edit Campaign',
          description: 'This Controller test the edit campaign button',
          amount: '10022',
          dueDate: '30-03-2012',
          youtubeUrl: 'https://www.youtube.com/watch?v=9xFsYfYrQHQ'

        };

        scope.editCampaign();
        $httpBackend.flush();
        expect($location.path().toBe('/campaign/54e2236b7146262c2c67423e'));
    });

});