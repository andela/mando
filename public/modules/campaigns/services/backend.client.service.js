'use strict';

angular.module('campaign').factory('backendService', ['$http', function($http) {

  //creates a campaign
  var addCampaign = function(campaignData) {
    return $http.post('/campaign/add', campaignData);
  };

  var getCampaign = function(campaignData) {
    return $http.get('/campaign/'+campaignData._id);
  };

  return {
    addCampaign: addCampaign,
    getCampaign: getCampaign
  };
}]);