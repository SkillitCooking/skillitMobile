'use strict';
angular.module('main')
.factory('DailyTipService', function (Restangular) {
  var baseTips = Restangular.all('dailyTips');

  return {
    getTipsOfTheDay: function() {
      return baseTips.customPOST({}, 'getTipsOfTheDay');
    },
    getTipsForCollection: function(collectionId) {
      return baseTips.customPOST({collectionId: collectionId}, 'getTipsForCollection');
    }
  };

});
