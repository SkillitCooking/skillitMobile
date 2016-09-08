'use strict';
angular.module('main')
.factory('dryStepService', ['_', 'StepTipService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, GeneralTextService, STEP_TYPES, ErrorService) {
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
            var concatIngredients;
            if(recipe.recipeType !== 'BYO') {
              concatIngredients = ingredientType.ingredients;
            } else {
              concatIngredients = _.filter(ingredientType.ingredients, function(ingredient){
                return ingredient.useInRecipe;
              });
            }
            step.ingredientsToDry = concatIngredients;
            var productIngredients = _.forEach(angular.copy(concatIngredients), function(ingredient) {
              ingredient.hasBeenUsed = true;
            });
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: productIngredients,
              dishes: [],
              sourceStepType: STEP_TYPES.DRY
            };
          } 
        } else {
          //error: ingredientType could not be found via key
          console.log("dryStepService Error: no ingredientType found with input :", input);
          ErrorService.logError({
            message: "Dry Step Service ERROR: no ingredientType found for input key in function 'instantiateStep'",
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
        if(referencedStep){
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.ingredientsToDry = referencedStep.products[input.key].ingredients;
              var productIngredients = _.forEach(angular.copy(step.ingredientsToDry), function(ingredient) {
                ingredient.hasBeenUsed = true;
              });
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: productIngredients,
                dishes: [],
                sourceStepType: STEP_TYPES.DRY
              };
            } else {
              //error - no products on referencedStep
              ErrorService.logError({
                message: "Dry Step Service ERROR: cannot find products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } 
        } else {
          //error - can't find referencedStep
          ErrorService.logError({
            message: "Dry Step Service ERROR: cannot find step with input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default: 
        //error for unexpected sourceType
        console.log("dryStepService error: unexpected sourceType: ", input);
        ErrorService.logError({
          message: "Dry Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
          input: input,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //set is empty
    if(step.ingredientsToDry.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
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
      var stepText = dryMethod + " dry ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToDry);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToDry);

      switch(step.ingredientsToDry.length) {
        case 0:
          //error
          stepText = "NO INGREDIENTS TO DRY";
          console.log("dryStepService error: no ingredientsToDry");
          ErrorService.logError({
            message: "Dry Step Service ERROR: no ingredients to dry in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToDry[0].prefix + " " + step.ingredientsToDry[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToDry[0].prefix + " " + step.ingredientsToDry[0].displayName.toLowerCase() + " and " + step.ingredientsToDry[1].prefix + " " + step.ingredientsToDry[1].displayName.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToDry.length - 1; i >= 0; i--) {
            if(i === 0){
              stepText += "and " + step.ingredientsToDry[i].prefix + " " + step.ingredientsToDry[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToDry[i].prefix + " " + step.ingredientsToDry[i].displayName.toLowerCase() + ", ";
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
