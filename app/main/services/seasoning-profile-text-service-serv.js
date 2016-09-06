'use strict';
angular.module('main')
.factory('SeasoningProfileTextService', function () {
  var service = {};

  service.addSeasoning = function(step, profile) {
    //to effect a line break
    step.seasoningInfo = [];
    step.seasoningInfo.push("For " + profile.name + " seasoning:");
    for (var i = 0; i < profile.spices.length; i++) {
      step.seasoningInfo.push(profile.spices[i]);
    }
  };

  return service;
});
