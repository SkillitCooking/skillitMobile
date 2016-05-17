'use strict';
angular.module('main')
.factory('customStepService', ['StepTipService', function (StepTipService) {
  var service = {};

  function instantiateStep (step, recipe) {
    //not doing anything with inputs currently...
    //instantiate later with more time
    //assuming, for now, that there will be no ingredientTips that are
    //either general to all Steps or specific to the Custom type...
    StepTipService.setStepTipInfo(step, []);
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
}]);
