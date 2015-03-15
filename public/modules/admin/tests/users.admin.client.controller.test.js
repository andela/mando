'use strict';

describe('adminUserCtrl', function() {
  var adminUserCtrl, scope, $httpBackend;
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
  var roles = [{
    roleType: 'member'
  }, {
    roleType: 'admin'
  }, {
    roleType: 'distributor'
  }];
  var users = [{
    '_id': '54e4b7eba241567dbbec7122',
    'lastModifiedBy': '54da2257568f9cfd6d2dba2f',
    'roles': [{
        roleType: 'admin'
        }]
  }, {
    '_id': '54e4b7eba241567dbbec7122',
    'lastModifiedBy': '54da2257568f9cfd6d2dba2f',
  }];
  //loading the main Application module
  //should refactor all beforeEach to a file
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($modal) {
    spyOn($modal, 'open').and.returnValue(fakeModal);
  }));
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, Authentication, _$modal_) {
    scope = $rootScope.$new();
    Authentication.user = {
      '_id': '54da2257568f9cfd6d2dba2f',
      roles: [{
        roleType: 'admin'
      }]
    };
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('/admin/users').respond(200, users);
    $httpBackend.whenPUT('/admin/user/roles/edit').respond(users);
    $httpBackend.whenGET('modules/core/views/home.client.view.html').respond(200, 'home page');
    adminUserCtrl = $controller('adminUserCtrl', {
      $scope: scope,
      $modal: _$modal_
    });
  }));

  it('should return all users in the system', function() {
    $httpBackend.flush();
    console.log(1, scope.users);
    expect(scope.users).toBeDefined();
    expect(scope.users.length).toBeGreaterThan(1);
    // scope.users[1].checked = true;
    scope.openModal();
    console.log(4, scope.modalInstance.confirmCallBack);
    scope.modalInstance.close(roles);
    console.log(scope.roes);
    expect(scope.roes).toBeDefined();
    $httpBackend.flush();
    expect(scope.users).toBeDefined();
    expect(scope.allChecked).toBe(false);
    expect(scope.noChecked).toBe(true);
  });
});
