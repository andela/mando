'use strict';

angular.module('campaign').config(['$stateProvider', '$sceDelegateProvider', function($stateProvider, $sceDelegateProvider) {
  $stateProvider.
    state('addCampaign', {
      url: '/campaign/add',
      templateUrl: 'modules/campaigns/views/addCampaign.client.view.html'
    }).
    state('viewCampaign', {
      url: '/campaign/:campaignid',
      templateUrl: 'modules/campaigns/views/viewCampaign.client.view.html'
    });

    // Add YouTube to resource whitelist so that we can embed YouTube videos
    // $sceDelegateProvider.resourceUrlWhitelist(['http://www.youtube.com/**']);
}]);
