'use strict';
angular.module('main')
.factory('SeasoningProfileTextService', function () {
  var service = {};

  service.addSeasoning = function(step, profile) {
    //part 1: find insertion point
    //part 2: insert
    step.seasoningInfo = ["For " + profile.name + " seasoning:"];
    for (var i = profile.spices.length - 1; i >= 0; i--) {
      step.seasoningInfo.push(profile.spices[i]);
    }
  };

  return service;
});
