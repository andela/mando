'use strict';
/*global spyOn */
describe('view campaign controller', function() {
  var viewCampaignCtrl, scope, httpBackend, mockBankerService, stateParams, campaign, backers;
  campaign = {
    account_id: 'abcdef123456',
    amount: '2000',
    _id: '1234567890',
    createdBy: {
      _id: '12233333'
    }
  };

  backers = [{
    amountDonated: '20',
    created: Date.now()
  }];
  var fakeModal = {
    result: {
      then: function(confirmCallback, cancelCallback) {
        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        this.confirmCallBack = confirmCallback;
        this.cancelCallback = cancelCallback;
      }
    },
    close: function(item) {
      //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
      this.result.confirmCallBack(item);
    },
    dismiss: function(type) {
      //The user clicked cancel on the modal dialog, call the stored cancel callback
      this.result.cancelCallback(type);
    }
  };
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(function() {
    mockBankerService = {
      getBalance: function(e, cb) {
        return cb('100');
      },
      getJournals: function(e, cb) {
        return cb([{
          description: '{"name": "bayo", "email": "example@example.com"}'
        }]);
      },
      setCredentials: function() {},
      isBanker: function() {}
    };

    module(function($provide) {
      $provide.value('subledgerServices', mockBankerService);
    });
  });
  beforeEach(inject(function($modal) {
    spyOn($modal, 'open').and.returnValue(fakeModal);
  }));
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, Authentication, $stateParams, _$modal_) {
    scope = $rootScope.$new();
    $stateParams = {
      campaignTimeStamp: '123456',
      campaignslug: 'new-campaign'
    };
    httpBackend = _$httpBackend_;
    Authentication.user = {
      roles: {
        roleType: 'member'
      }
    };
    Authentication.requireLogin = function($state, stateName) {};
    Authentication.requireRole = function($state, role, stateName) {};
    Authentication.hasRole = function($state, role, stateName) {};
    viewCampaignCtrl = $controller('viewCampaignCtrl', {
      $scope: scope,
      $modal: _$modal_,
      credentials: {
        data: {
          key_id: 'value22323',
          secret_id: 'a mock secret'
        }
      },
      $stateParams: {
        campaignTimeStamp: '123456',
        campaignslug: 'new-campaign'
      }
    });
    httpBackend.expectGET('/campaign/123456/new-campaign').respond(200, campaign);
    httpBackend.expectGET('/campaigns/1234567890/backers').respond(200, backers);
  }));
  it('should get campaign details and balance', function() {
    expect(scope.campaign).not.toBeDefined();
    httpBackend.flush();
    expect(scope.campaign).toBeDefined();
    expect(scope.campaign.amount).toBe('2000');
    expect(scope.campaign.account_id).toBe('abcdef123456');
    // expect(scope.campaignBalance).toBe('100');
    scope.openModal();
  });
});
