'use strict';
angular.module('main')
.factory('reduceHeatStepService', ['_', 'StepTipService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var input = step.stepInputs["reduceHeatObjectInput"];
    switch(input.sourceType) {
      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === input.sourceId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products) {
              step.dishToReduce = referencedStep.products[input.key].dishes[0];
              step.ingredientsInDish = referencedStep.products[input.key].ingredients;
              if(!step.products) {
                step.products = {};
              }
              var productIngredients = _.forEach(angular.copy(referencedStep.products[input.key].ingredients), function(ingredient) {
                ingredient.hasBeenUsed = true;
              });
              step.products[step.productKeys[0]] = {
                ingredients: productIngredients,
                dishes: [step.dishToReduce],
                sourceStepType: STEP_TYPES.REDUCEHEAT
              };
            } else {
              //error - no products for found step
              ErrorService.logError({
                message: "ReduceHeat Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          }
        } else {
          //error - no step found...
          ErrorService.logError({
            message: "ReduceHeat Step Service ERROR: no step found for input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;
      default:
        //error - unexpected sourceType
        console.log("reduceHeatStepService error: unexpected sourceType: ", input);
        ErrorService.logError({
          message: "ReduceHeat Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
          input: input,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //set isEmpty
    if(!step.dishToReduce) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set tip
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsInDish);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var heatSetting = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "heatSetting";
      }).val;
      var removeFromHeat = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "removeFromHeat";
      }).val;
      var stepText = "";
      if(removeFromHeat) {
        stepText = "Remove the " + step.dishToReduce.name.toLowerCase() + " from heat";
      } else {
        stepText = "Reduce heat on the " + step.dishToReduce.name.toLowerCase() + " to " + heatSetting;
      }
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate
    instantiateStep(step, recipe);
    //construct
    constructStepText(step);
  };

  service.constructAuxiliaryStep = function(step, dish) {
    var heatSetting = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "heatSetting";
    }).val;
    var removeFromHeat = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "removeFromHeat";
    }).val;
    var auxStepText = "";
    if(removeFromHeat) {
      auxStepText = "Remove the " + dish.name.toLowerCase() + " from heat";
    } else {
      auxStepText = "Reduce heat on the " + dish.name.toLowerCase() + " to " + heatSetting;
    }
    step.text = auxStepText;
  };

  return service;
}]);
