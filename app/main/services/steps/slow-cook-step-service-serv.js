'use strict';
angular.module('main')
.factory('slowCookStepService', ['_', 'StepTipService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    step.ingredientsToSlowCook = [];
    var ingredientInputs = step.stepInputs["ingredientInputs"];
    //get ingredients
    for (var i = ingredientInputs.length - 1; i >= 0; i--) {
      var input = ingredientInputs[i];
      switch(input.sourceType) {
        case "IngredientList":
          var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
            return type.typeName === input.key;
          });
          if(ingredientType) {
            if(ingredientType.ingredients.length > 0) {
              var concatIngredients;
              if(recipe.recipeType !== 'BYO') {
                concatIngredients = ingredientType.ingredients;
              } else {
                concatIngredients = _.filter(ingredientType.ingredients, function(ingredient){
                  return ingredient.useInRecipe;
                });
              }
              step.ingredientsToSlowCook = step.ingredientsToSlowCook.concat(concatIngredients);
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  dishes: [],
                  sourceStepType: STEP_TYPES.SLOWCOOK
                };
              }
              var productIngredients = angular.copy(concatIngredients);
              _.forEach(productIngredients, function(ingredient) {
                ingredient.transformationPrefix = "";
                ingredient.hasBeenUsed = true;
              });
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
            }
          } else {
            //error - no ingredientType found
             ErrorService.logError({
              message: "SlowCook Step Service ERROR: no ingredientType found for input in function 'instantiateStep'",
              input: input,
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === input.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products) {
                step.ingredientsToSlowCook = step.ingredientsToSlowCook.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: [],
                    dishes: [],
                    sourceStepType: STEP_TYPES.SLOWCOOK
                  };
                }
                var productIngredients = angular.copy(referencedStep.products[input.key].ingredients);
                _.forEach(productIngredients, function(ingredient) {
                  ingredient.transformationPrefix = "";
                  ingredient.hasBeenUsed = true;
                });
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
              } else {
                //error - no product for step
                ErrorService.logError({
                  message: "SlowCook Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            }
          } else {
            //error - can't find step
            ErrorService.logError({
              message: "SlowCook Step Service ERROR: no can't find step from input in function 'instantiateStep'",
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
            message: "SlowCook Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
          break;
      }
    }
    //set isEmpty condition
    if(step.ingredientsToSlowCook.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToSlowCook);
    }
  }

  function constructStepText(step) {
    if(step.isEmpty) {
      var slowCookDuration = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "slowCookDuration";
      }).val;
      var tempSetting = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "tempSetting";
      }).val;
      var stepText = "Slow cook ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToSlowCook);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToSlowCook);

      switch(step.ingredientsToSlowCook.length) {
        case 0: 
          //error
          stepText = "NO INGREDIENTS TO SLOW COOK!";
          console.log("slowCookStepService error: no ingredientsToSlowCook");
          ErrorService.logError({
            message: "SlowCook Step Service ERROR: no ingredients to slow cook in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToSlowCook[0].prefix + " " + step.ingredientsToSlowCook[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToSlowCook[0].prefix + " " + step.ingredientsToSlowCook[0].displayName.toLowerCase() + " and " + step.ingredientsToSlowCook[1].prefix + " " + step.ingredientsToSlowCook[1].displayName.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToSlowCook.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToSlowCook[i].prefix + " " + step.ingredientsToSlowCook[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToSlowCook[i].prefix + " " + step.ingredientsToSlowCook[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      stepText += " on " + tempSetting;
      stepText += " " + slowCookDuration;
      step.text = stepText;
    }
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
