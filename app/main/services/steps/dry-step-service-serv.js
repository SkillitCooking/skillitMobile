'use strict';
angular.module('main')
.factory('dryStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var input = step.stepInputs["ingredientInput"];
    //expects either IngredientList or StepProduct
    switch (input.sourceType) {
      case "IngredientList":
        var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
          return type.typeName === input.key;
        });
        if(ingredientType) {
          if(ingredientType.ingredients.length > 0) {
            step.ingredientsToDry = ingredientType.ingredients;
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: step.ingredientsToDry,
              dishes: []
            };
            step.isEmpty = false;
          } else {
            step.isEmpty = true;
          }
        } else {
          //error: ingredientType could not be found via key
          console.log("dryStepService Error: no ingredientType found with input :", input);
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === input.sourceId;
        });
        if(referencedStep){
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.ingredientsToDry = referencedStep.products[input.key].ingredients;
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: step.ingredientsToDry,
                dishes: []
              };
              step.isEmpty = false;
            } else {
              //error - no products on referencedStep
              console.log("dryStepService Error: cannot find products for referencedStep: ", referencedStep);
            }
          } else {
            step.isEmpty = true;
          }
        } else {
          //error - can't find referencedStep
          console.log("dryStepService Error: cannot find step with input: ", input);
        }
        break;

      default: 
        //error for unexpected sourceType
        console.log("dryStepService error: unexpected sourceType: ", input);
        break;
    }
    //set stepTip
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, ingredientsToDry);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var dryMethod = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "dryMethod";
      }).val;
      var stepText = dryMethod + " dry the ";
      switch(step.ingredientsToDry.length) {
        case 0:
          //error
          stepText = "NO INGREDIENTS TO DRY";
          console.log("dryStepService error: no ingredientsToDry");
          break;

        case 1:
          stepText += step.ingredientsToDry[0].name;
          break;

        case 2:
          stepText += step.ingredientsToDry[0].name + " and " + step.ingredientsToDry[1].name;
          break;

        default:
          for (var i = step.ingredientsToDry.length - 1; i >= 0; i--) {
            if(i === 0){
              stepText += "and " + step.ingredientsToDry[i].name;
            } else {
              stepText += step.ingredientsToDry[i].name + ", ";
            }
          }
          break;
      }
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate Step
    instantiateStep(step, recipe);
    //construct Step
    constructStepText(step);
  };

  return service;
}]);