'use strict';
angular.module('main')
.factory('bringToBoilStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  function instantiateStep(step, recipe) {
    //know that there's just a dishInput
    var input = step.stepInputs["dishInput"];
    //expects EquipmentList, all others generate errors
    switch(input.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === input.key;
        });
        if(dish){
          step.boilingDish = dish;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {};
          }
          step.products[step.productKeys[0]].dishes = [step.boilingDish];
        } else {
          //error
          console.log("bringToBoilStepService Error: cannot find dish from input", input);
        }
        break;

      default:
        //then unexpected sourceType
        console.log("bringToBoilStepService Error: unexpected sourceType: ", input.sourceType);
        break;
    }
    //step tips
    StepTipService.setStepTipInfo(step, []);
  }

  function constructStepText(step) {
    var waterAmount = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "waterAmount";
    }).val;
    var stepText = "Bring ";
    if(waterAmount && waterAmount !== ""){
      stepText += waterAmount + " of water to boil ";
    } else {
      stepText += "water to boil ";
    }
    stepText += "in a " + step.boilingDish.name;
    step.text = stepText;
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //construct step text
    constructStepText(step);
  };

  return service;
}]);
