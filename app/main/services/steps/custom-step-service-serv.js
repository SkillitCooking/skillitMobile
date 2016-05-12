'use strict';
angular.module('main')
.service('customStepService', function ($log) {
  var service = {};

  function instantiateStep (step, recipe) {
    //not doing anything with inputs currently...
    //instantiate later with more time
  }

  function constructStepText(step) {
    var stepText = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "customStepText";
    }).val;
    step.text = stepText;
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //constructStep
    constructStepText(step);
  };

  return service;
});
