'use strict';

angular.module('campaign').config(['$stateProvider', 'datepickerConfig', '$sceDelegateProvider', function($stateProvider, datepickerConfig, $sceDelegateProvider) {
  //ui-bootstrap config service to set starting day to 1,
  //this is done because of the disparity in week number between moment.js and ui-bootstrap
  datepickerConfig.startingDay = '1';

  $stateProvider.
    state('addCampaign', {
      url: '/campaign/add',
      templateUrl: 'modules/campaigns/views/addCampaign.client.view.html'
    }).
    state('editCampaign', {
      url: '/campaign/:campaignTimestamp/:campaignslug/edit',
      templateUrl: 'modules/campaigns/views/editCampaign.client.view.html'
    }).
    state('viewCampaign', {
      url: '/campaign/:campaignTimeStamp/:campaignslug',
      templateUrl: 'modules/campaigns/views/viewCampaign.client.view.html'
    }).
    state('allCampaigns', {
      url: '/campaigns',
      templateUrl: 'modules/campaigns/views/allCampaigns.client.view.html'
    }).
    state('userCampaigns', {
      resolve: {
        credentials: function ($http){
          return  $http.get('/credentials');
        }
      },
      url: '/campaigns/myAndonation',
      templateUrl: 'modules/campaigns/views/userCampaigns.client.view.html',
      controller: 'userCampaignsCtrl'
    });

    //Add YouTube to resource whitelist so that we can embed YouTube videos
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
}]);
