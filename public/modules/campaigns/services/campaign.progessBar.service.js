'use strict';

angular.module('campaign').factory('progressBarService', function() {
  var updateProgressBar = function(campaignBalance, campaignAmount, cb) {
    var fundsRatio = campaignBalance/campaignAmount;
    var fundRaised, campaignFundPercentage;
    campaignFundPercentage = Math.floor(fundsRatio * 96);
      if(campaignFundPercentage === 0) {
        fundRaised = 4;
        campaignFundPercentage = 0;
      }
      else {
        fundRaised = campaignFundPercentage + Math.ceil(4*fundsRatio);
        campaignFundPercentage = fundRaised;
        if(campaignFundPercentage < 4) {
          fundRaised = 4;
        }
      }
      cb(fundRaised, campaignFundPercentage);
  };
  return {
    updateProgressBar: updateProgressBar
  };
});