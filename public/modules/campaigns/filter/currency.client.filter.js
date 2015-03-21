'use strict';
angular.module('campaign').filter('currencyflt', function() {
  return function cur(num) {
    if(num) {
    for (var x = 0; x < num.length; x += 3) {
      if (x > 2) {
        num = num.slice(0, -x) + ',' + num.slice(-x);
        x++;
      }
    }
    num = '$' + num;
    return num;
  }
  return '$0';
};
 // cur('123456789012345678901234567890');
});
