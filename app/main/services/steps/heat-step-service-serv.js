'use strict';
angular.module('main')
.service('heatStepService', ['_', 'StepTipService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var input = step.stepInputs["dishInput"];
    //expects just something from the equipmentList
    switch(input.sourceType){
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === input.key;
        });
        if(dish) {
          step.dishToHeat = dish;
          if(!step.products){
            step.products = {};
          }
          step.products[step.productKeys[0]] = {
            ingredients: [],
            dishes: [step.dishToHeat],
            sourceStepType: STEP_TYPES.HEAT
          };
        } else {
          //error - couldn't find dish
          ErrorService.logError({
            message: "Heat Step Service ERROR: cannot find dish for input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error - unexpected sourceType
        ErrorService.logError({
          message: "Heat Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
          input: input,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    StepTipService.setStepTipInfo(step, []);
  }

  function constructStepText(step) {
    var heatsOil = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "heatsOil";
    }).val;
    var heatSetting = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "heatSetting";
    }).val;
    var stepText = "";
    if(heatsOil) {
      stepText  = "Add oil or butter to a " + step.dishToHeat.name.toLowerCase() + " and heat over " +
        heatSetting + " heat";
    } else {
      stepText = "Heat a " + step.dishToHeat.name.toLowerCase() + " over " + heatSetting +
        " heat";
    }
    step.text = stepText;
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiateStep
    instantiateStep(step, recipe);
    //constructStep
    constructStepText(step);
  };

  return service;
}]);
