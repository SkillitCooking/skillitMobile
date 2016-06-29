'use strict';
angular.module('main')
.service('DailyTipService', function (Restangular) {
  var baseTips = Restangular.all('dailyTips');

  return {
    getTipsOfTheDay: function() {
      return baseTips.customPOST({}, 'getTipsOfTheDay');
    }
  };

});
