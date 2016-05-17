'use strict';
angular.module('main')
.service('heatStepService', ['_', 'StepTipService', function (_, StepTipService) {
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
            dishes: [step.dishToHeat]
          };
        } else {
          //error - couldn't find dish
          console.log("heatStepService error: cannot find dish for input: ", input);
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("heatStepService error: unexpected sourceType: ", input);
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
      stepText  = "Add oil to " + step.dishToHeat.name + " and then heat it over " +
        heatSetting + " heat";
    } else {
      stepText = "Heat " + step.dishToHeat.name + " over " + heatSetting +
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
