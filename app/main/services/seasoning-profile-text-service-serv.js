'use strict';
angular.module('main')
.factory('SeasoningProfileTextService', function () {
  var service = {};

  service.addSeasoning = function(step, profile) {
    //part 1: find insertion point
    //part 2: insert
    var index = step.text.indexOf(". For seasoning you can use");
    if(index !== -1) {
      //slice
      step.text = step.text.slice(0, index);
    }
    step.text += ". For seasoning you can use " + profile.name + ": " + 
      profile.spices.join(', ');
  };

  return service;
});
