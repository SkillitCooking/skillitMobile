'use strict';
angular.module('main')
.factory('preheatOvenStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  //no inputs, no products... for now
  function instantiateStep(step, recipe) {
    StepTipService.setStepTipInfo(step, []);
    //make below more sophisticated when detecting for no Bake Step...
    step.isEmpty = false;
  }

  function constructStepText(step) {
    var overTemperature = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "ovenTemperature";
    }).val;
    var stepText = "Preheat oven to " + overTemperature;
    step.text = stepText;
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate
    instantiateStep(step, recipe);
    //construct
    constructStepText(step);
  };

  return service;
}]);
