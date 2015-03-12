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
         $httpBackend.expectPOST('060151/latest-campaign').respond( 200, 
            {
              'slug': '060151/latest-campaign',
              'message' : 'Edited successfully',
              'title': 'Edit Campaign'

        });
        
        scope.campaign = {
          title : 'Edit Campaign',
          description: 'This Controller test the edit campaign button',
          amount: '10022',
          dueDate: '30-03-2012',
          youtubeUrl: 'https://www.youtube.com/watch?v=9xFsYfYrQHQ',
          slug: '060151/latest-campaign'
        };
        scope.editCampaign();
     //expect('/GET', youtubeUrl);
       $httpBackend.expectGET('/GET').respond(200, {
        youtubeUrl: 'https://www.youtube.com/watch?v=9xFsYfYrQHQ'
       });
       $httpBackend.flush();
      expect($location.path().toBe('/campaign/060151/latest-campaign')); 
      // expect()
    });

});