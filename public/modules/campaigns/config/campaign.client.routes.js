'use strict';

angular.module('campaign').config(['$stateProvider', '$sceDelegateProvider', function ($stateProvider, $sceDelegateProvider) {
  $stateProvider.
    state('addCampaign', {
      url: '/campaign/add',
      templateUrl: 'modules/campaigns/views/addCampaign.client.view.html'
    }).
    state('editCampaign', {
      url: '/campaign/:campaignid/edit',
      templateUrl: 'modules/campaigns/views/editCampaign.client.view.html'
    }).
    state('viewCampaign', {
      url: '/campaign/:campaignid',
      templateUrl: 'modules/campaigns/views/viewCampaign.client.view.html'
    }).
    state('userCampaigns', {
      url: '/campaigns/:userid',
      templateUrl: 'modules/campaigns/views/userCampaigns.client.view.html'
    });

    //Add YouTube to resource whitelist so that we can embed YouTube videos
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
}]);

//ANGULAR 1.2 HAS A NEW SECURITY POLICY TO BLOCK OR PREVENT HACKERS

