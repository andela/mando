'use strict';
/* global spyOn */
describe('adminUserCtrl', function() {
  var adminUserCtrl, scope, $httpBackend, timeout, NoOfCheckedUsers;
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

  var SelectedRoles = [{
    roleType: 'member'
  }, {
    roleType: 'admin'
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
    'roles': [{
      roleType: 'admin'
    }, {
      roleType: 'distributor'
    }]
  }];
  //loading the main Application module
  //should refactor all beforeEach to a file
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($modal) {
    spyOn($modal, 'open').and.returnValue(fakeModal);
  }));
  beforeEach(inject(function($controller, _$timeout_, $rootScope, _$httpBackend_, Authentication, _$modal_) {
    timeout = _$timeout_;
    scope = $rootScope.$new();
    Authentication.user = {
      '_id': '54da2257568f9cfd6d2dba2f',
      roles: [{
        roleType: 'admin'
      }]
    };
    Authentication.requireRole = function($state, role, stateName) {
      //redirects user to myAndonation is user is logged in and not an admin
      // if (!lodash.findWhere(user.roles, {'roleType': role})) {
      //   $state.go(stateName);
      // }
    };
    Authentication.requireLogin = function($state, stateName) {
      // if (!user) {
      //   $state.go(stateName || 'home');
      // }
    };
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('/admin/users').respond(200, users);
    $httpBackend.whenPUT('/admin/user/roles/edit').respond(users);
    $httpBackend.whenGET('modules/core/views/home.client.view.html').respond(200, 'home page');

    adminUserCtrl = $controller('adminUserCtrl', {
      $scope: scope,
      $modal: _$modal_,
    });
  }));

  it('should return all users in the system', function() {
    $httpBackend.flush();
    expect(scope.users).toBeDefined();
    expect(scope.users.length).toBeGreaterThan(1);
  });

  it('should open modal window and return the check user', function() {
    $httpBackend.flush();
    expect(scope.users).toBeDefined();
    expect(scope.users.length).toBeGreaterThan(1);
    scope.checkAll();
    scope.openModal();
    scope.modalInstance.close(SelectedRoles);
    $httpBackend.flush();
    expect(scope.users).toBeDefined();
    expect(scope.allChecked).toBe(false);
    expect(scope.noChecked).toBe(true);
  });

  it('should check all users, and give them a status of checked', function() {
    $httpBackend.flush();
    scope.checkAll();
    var i;
    timeout(function() {
      for (i = 0; i < scope.users.length; i++) {
        expect(scope.users[i].checked).toBe(true, 'all user is checked');
      }
      expect(scope.noChecked).toBe(false, 'no user is unchecked');
    }, 300);

    scope.checkAll();
    timeout(function() {
      for (i = 0; i < scope.users.length; i++) {
        expect(scope.users[i].checked).toBe(false, 'all user is checked');
      }
      expect(scope.noChecked).toBe(true, 'all user is unchecked');
    }, 300);
  });
});
