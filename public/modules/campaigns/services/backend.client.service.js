'use strict';

angular.module('campaign').factory('backendService', ['$http', function($http) {

  //creates a campaign
  var addCampaign = function(campaignData) {
    return $http.post('/campaign/add', campaignData);
  };

  var getCampaign = function(campaignData) {
    return $http.get('/campaign/'+campaignData._id);
  };

  var checkYouTubeUrl = function(videoId) {
    return $http.get('//gdata.youtube.com/feeds/api/videos/'+videoId+'?alt=json');
  };

  var getUserCampaigns = function(userData) {
    return $http.get('/campaigns/' +userData._id);
  };

  return {
    addCampaign: addCampaign,
    getCampaign: getCampaign,
    checkYouTubeUrl: checkYouTubeUrl,
    getUserCampaigns: getUserCampaigns
  };
}]);