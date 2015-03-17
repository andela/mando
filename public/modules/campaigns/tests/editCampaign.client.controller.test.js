'use strict';

describe('editCampaignCtrl', function() {

  var editCampaignCtrl,
      scope,
      $httpBackend,
      $stateParams,
      $location;

    //Loading the main Application module
beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $location =  _$location_;
    _$stateParams_.campaignTimestamp = '060151';
    _$stateParams_.campaignslug = 'latest-campaign';

    _Authentication_.user = {
      _id: 'abc'
    };

    editCampaignCtrl= $controller('editCampaignCtrl', {
      $scope: scope,
      $location: $location,
      $stateParams: _$stateParams_,
      Authentication: _Authentication_
    });
  }));

  beforeEach(function() {
    $httpBackend.expectGET('/campaign/060151/latest-campaign').respond(200, {
      title : 'Edit Campaign',
      description: 'This Controller test the edit campaign button',
      amount: '10022',
      dueDate: '30-03-2012',
      youtubeUrl: 'https://www.youtube.com/watch?v=9xFsYfYrQHQ',
      slug: '060151/latest-campaign',
      createdBy: {
        _id: 'user2'
      }
    });
    $httpBackend.whenGET('modules/campaigns/views/viewCampaign.client.view.html').respond(200);
    $httpBackend.whenGET('modules/core/views/home.client.view.html').respond(200);
  });

    it('should be able to edit a campaign successfully', function(){
         $httpBackend.expectPUT('/campaign/123/edit').respond( 200, 
            {
              'slug': '060151/latest-campaign',
              'message' : 'Edited successfully',
              'title': 'Edit Campaign',
              createdBy: {
                _id: 'user2'
              }
        });
        scope.campaign = {
          title : 'Edit Campaign',
          description: 'This Controller test the edit campaign button',
          amount: '10022',
          dueDate: '30-03-2012',
          youtubeUrl: 'https://www.youtube.com/watch?v=9xFsYfYrQHQ',
          slug: '060151/latest-campaign',
          _id: '123'
        };
        scope.editCampaign();
       
       $httpBackend.flush();
      expect($location.path()).toEqual('/campaign/060151/latest-campaign'); 
    });

});