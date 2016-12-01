'use strict';
angular.module('main')
.factory('SeasoningUsedService', function (Restangular) {
  var baseSeasoningUsed = Restangular.all('seasoningUsed');

  return {
    postSeasoningUsed: function(info) {
      return baseSeasoningUsed.customPOST(info, '/');
    };
  };
});
