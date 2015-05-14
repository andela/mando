'use strict';

angular.module('campaign').factory('daysLeftService', function() {
  var getDaysLeft = function(dueDate, cb) {
    var currentDate = new Date(Date.now());
    var campaignDeadline = new Date(dueDate);
    var daysLeft, deadlineStyle;
    daysLeft = Math.ceil((campaignDeadline - currentDate)/(1000 * 3600 * 24));
        if(daysLeft >= 10) {
          deadlineStyle = 'success';
        }
        else if(daysLeft > 5 && daysLeft < 10) {
          deadlineStyle = 'warning';
        }
        else if(daysLeft <= 5 && daysLeft >= 0) {
          deadlineStyle = 'danger';
        }
        else if(daysLeft < 0) {
          daysLeft = 'none';
        }

      cb(daysLeft, deadlineStyle);
  };
  return {
    getDaysLeft: getDaysLeft
  };
});