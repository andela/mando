'use strict';

angular.module('campaign').config(['$stateProvider', function($stateProvider) {
  $stateProvider.
    state('addCampaign', {
      url: '/campaign/add',
      templateUrl: 'modules/campaigns/views/addCampaign.client.view.html'
    }).
    state('viewCampaign', {
      url: '/campaign/:campaignId',
      templateUrl: 'modules/campaigns/views/viewCampaign.client.view.html'
    });
}]);