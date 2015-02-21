'use strict';

angular.module('campaign').controller('editCampaignCtrl', ['$scope','backendService', '$location,', 'Authentication', function ($scope, backendService, $location, Authentication) {
    $scope.Authentication = Authentication;
    
    //route unauhenticated user  to the camapaign view page goes
    if(!$scope.Authentication.user){

    $location.path('/campaign/:campaignid');
    }



}
]);