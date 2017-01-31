'use strict';
angular.module('main')
.factory('breakEggStepService', ['_', 'StepTipService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    //expect just ingredientList, single ingredient input despite infrastructure for multiple
    var ingredientInput = step.stepInputs["ingredientInputs"][0];
    switch(ingredientInput.sourceType) {
      case "IngredientList":
        var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
          return type.typeName === ingredientInput.key;
        });
        if(ingredientType) {
          if(ingredientType.ingredients.length > 0) {
            step.ingredientsToBreak = _.filter(ingredientType.ingredients, function(ingredient) {
              return ingredient.useInRecipe;
            });
            var productIngredients = _.forEach(angular.copy(step.ingredientsToBreak), function(ingredient) {
              ingredient.transformationPrefix = "";
              ingredient.hasBeenUsed = true;
            });
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: productIngredients,
              dishes: [],
              sourceStepType: STEP_TYPES.BREAKEGG
            };
          }
        } else {
          //error: ingredientType could not be found via key
          console.log("breakEggStepService Error: no ingredientType found with input :", ingredientInput);
          ErrorService.logError({
            message: "BreakEgg Step Service ERROR: no ingredientType found for input key in function 'instantiateStep'",
            input: ingredientInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error for unexpected sourceType
        console.log("breakEggStepService error: unexpected sourceType: ", ingredientInput);
        ErrorService.logError({
          message: "BreakEgg Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
          input: ingredientInput,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //ignore dishInput for now... unimportant/won't be used
    //set is empty
    if(step.ingredientsToBreak.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set stepTip
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToBreak);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var isWhisk = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "isWhisk";
      }).val;
      var stepText = "Break your desired number of ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToBreak);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToBreak);

      switch(step.ingredientsToBreak.length) {
        case 0:
          //error
          stepText = "NO INGREDIENTS TO BREAK";
          console.log("breakEggStepService error: no ingredientsToMove");
          ErrorService.logError({
            message: "Move Step Service ERROR: no ingredients to move in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToBreak[0].prefix + " " + step.ingredientsToBreak[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToBreak[0].prefix + " " + step.ingredientsToBreak[0].displayName.toLowerCase() + " and " + step.ingredientsToBreak[1].prefix + " " + step.ingredientsToBreak[1].displayName.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToBreak.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToBreak[i].prefix + " " + step.ingredientsToBreak[i].displayName.toLowerCase(); 
            } else {
              stepText += step.ingredientsToBreak[i].prefix + " " + step.ingredientsToBreak[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      stepText += " into a bowl";
      if(isWhisk) {
        stepText += ", whisk thoroughly,";
      }
      stepText += " and set aside for later";
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //construct Step
    constructStepText(step);
  };

  return service;
}]);
