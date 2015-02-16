'use strict';

angular.module('campaign').factory('backendService', ['$http', function($http) {

  //creates a campaign
  var addCampaign = function(campaignData) {
    return $http.post('/campaign/add', campaignData);
  };

  var viewCampaign = function(campaignData) {
    return $http.get('/campaign/'+campaignData.campaignId);
  };

  return {
    addCampaign: addCampaign,
    viewCampaign: viewCampaign
  };
}]);