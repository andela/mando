'use strict';

angular.module('campaign').factory('backendService', ['$http', function($http) {

  //creates a campaign
  var addCampaign = function(campaignData) {
    return $http.post('/campaign/add', campaignData);
  };

  var getCampaign = function(campaignid) {
    return $http.get('/campaign/' + campaignid);
  };

  var deleteCampaign = function(campaignid) {
    return $http.delete('/campaign/' +campaignid);
  };

  var checkYouTubeUrl = function(videoId) {
    return $http.get('//gdata.youtube.com/feeds/api/videos/'+videoId+'?alt=json');
  };

  var getUserCampaigns = function(userid) {
    return $http.get('/campaigns/' + userid);
  };

  //get all campaigns for the homepage
  var getCampaigns = function() {
    return $http.get('/campaigns');
  };

  var updateCampaign = function(campaignData) {
    return $http.put('/campaign/' + campaignData._id + '/edit', campaignData);
  };

  var createCampaignBacker = function(backerData) {
    return $http.post('/campaign/backer/new', backerData);
  };

  var getCampaignBackers = function(campaignid) {
    return $http.get('/campaigns/' + campaignid + '/backers');
  };

  return {
    addCampaign: addCampaign,
    getCampaign: getCampaign,
    checkYouTubeUrl: checkYouTubeUrl,
    getUserCampaigns: getUserCampaigns,
    updateCampaign: updateCampaign,
    deleteCampaign: deleteCampaign,
    getCampaigns: getCampaigns,
    createCampaignBacker: createCampaignBacker,
    getCampaignBackers: getCampaignBackers
  };
}]);