'use strict';

describe('transactionCtrl', function() {
    var transactionCtrl,
        $scope,
        $httpBackend,
        mockBankerService;

    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(function() {
        mockBankerService = {
            getBalance: function(e, cb) {
                return cb(100);
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
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, Authentication) {
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        Authentication.user = {
            roles: 'banker'
        };
        Authentication.requireLogin = function($state, stateName) {};
        Authentication.requireRole = function($state, role, stateName) {};
        Authentication.hasRole = function($state, role, stateName) {};
        transactionCtrl = $controller('transactionCtrl', {
            $scope: $scope,
            credentials: {
                data: {
                    key_id: 'value22323',
                    secret_id: 'a mock secret'
                }
            },
        });
    }));
    it('should show the current balance in the system', function() {
        $scope.getBankBalance();
        expect($scope.balance.amount).toBe(100);
    });

    it('should show the journal reports in the system', function() {
        $scope.getJournals(function() {

            expect($scope.journal[0].description.name).toBe('bayo');
        });
    });
});
