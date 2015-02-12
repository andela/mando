'use strict';

angular.module('campaign').config('$stateProvider', function($stateProvider) {
  $stateProvider.
    state('addCampaign', {
      url: '/campaign/add',
      templateUrl: 'modules/campaign/views/addCampaign.client.view.html'
    }).
    state('viewCampaign', {
      url: '/campaign/:campaignid',
      templateUrl: 'modules/campaign/views/viewCampaign.client.view.html'
    });
});