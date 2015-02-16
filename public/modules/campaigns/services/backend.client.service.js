'use strict';

angular.module('campaign').factory('backendService', ['$http', function($http) {

  //creates a campaign
  var addCampaign = function(campaignData) {
    return $http.post('/campaign/add', campaignData);
  };

  var viewCampaign = function(campaignData) {
    return $http.get('/campaign/_id', campaignData);
  };

  return {
    addCampaign: addCampaign,
    viewCampaign: viewCampaign
  };
}]);