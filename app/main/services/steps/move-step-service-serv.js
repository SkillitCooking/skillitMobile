'use strict';
angular.module('main')
.factory('moveStepService', ['_', 'StepTipService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var input = step.stepInputs["stepInput"];
    switch(input.sourceType) {
      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === input.sourceId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products) {
              step.ingredientsToMove = referencedStep.products[input.key].ingredients;
              step.moveDish = referencedStep.products[input.key].dishes[0];
              var productIngredients = _.forEach(angular.copy(step.ingredientsToMove), function(ingredient) {
                ingredient.transformationPrefix = "";
                ingredient.hasBeenUsed = true;
              });
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: productIngredients,
                dishes: referencedStep.products[input.key].dishes,
                sourceStepType: STEP_TYPES.MOVE
              };
            } else {
              //error - no products on referencedStep
              ErrorService.logError({
                message: "Move Step Service ERROR: cannot find products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          }
        } else {
          ErrorService.logError({
            message: "Move Step Service ERROR: cannot find step with input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error for unexpected sourceType
        console.log("moveStepService error: unexpected sourceType: ", input);
        ErrorService.logError({
          message: "Move Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
          input: input,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //set is empty
    if(step.ingredientsToMove.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set stepTip
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToMove);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var moveType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "moveType";
      }).val;
      var stepText = moveType + " ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToMove);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToMove);

      switch(step.ingredientsToMove.length) {
        case 0:
          //error
          stepText = "NO INGREDIENTS TO MOVE";
          console.log("moveStepService error: no ingredientsToDry");
          ErrorService.logError({
            message: "Move Step Service ERROR: no ingredients to move in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToMove[0].prefix + " " + step.ingredientsToMove[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToMove[0].prefix + " " + step.ingredientsToMove[0].displayName.toLowerCase() + " and " + step.ingredientsToMove[1].prefix + " " + step.ingredientsToMove[1].displayName.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToMove.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToMove[i].prefix + " " + step.ingredientsToMove[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToMove[i].prefix + " " + step.ingredientsToMove[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      stepText += " to one side of the " + step.moveDish.name.toLowerCase();
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
