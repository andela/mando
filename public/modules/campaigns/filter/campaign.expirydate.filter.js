'use strict';
angular.module('campaign').filter('daysflt', function() {
  return function days(value) {
    var filteredDay;
    console.log(value);
    if(value.hoursLeft) {
      filteredDay = value.hoursLeft + ' Hours';
    }
    else if (value === 1) {
      filteredDay = '1 day';
    }
    else if (value > 1 || value === 0) {
      filteredDay = value + ' days';
    }
    else {
      filteredDay = 'This campaign is likely expired, no days ';
    }
      return filteredDay;
    };
  });
