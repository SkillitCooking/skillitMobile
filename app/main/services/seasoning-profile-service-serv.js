'use strict';
angular.module('main')
.factory('SeasoningProfileService', function (Restangular) {
  var baseSeasoningProfiles = Restangular.all('seasoningProfiles');

  return {
    getSeasoningProfiles: function() {
      return baseSeasoningProfiles.customGET('/');
    }
  };
});
