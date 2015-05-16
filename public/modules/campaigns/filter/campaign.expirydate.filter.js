'use strict';
angular.module('campaign').filter('daysflt', function() {
  return function days(value) {
    var filteredDay;
    if(value.hoursLeft) {
      if(value.hoursLeft <= 1){
        filteredDay = 1 + ' Hour';
      }
      else {
        filteredDay = value.hoursLeft + ' Hours';
      }
    }
    else if (value === 1) {
      filteredDay = '1 day';
    }
    else if (value > 1 || value === 0) {
      filteredDay = value + ' days';
    }
    else {
      filteredDay = '';
    }
      return filteredDay;
    };
  });
