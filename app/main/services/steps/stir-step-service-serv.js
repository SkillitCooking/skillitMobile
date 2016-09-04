'use strict';
angular.module('main')
.service('stirStepService', ['_', 'StepTipService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var input = step.stepInputs["stirObjectInput"];
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
            step.ingredientsToStir = concatIngredients;
            if(!step.products) {
              step.products = {};
            }
            var productIngredients = _.forEach(angular.copy(concatIngredients), function(ingredient) {
              ingredient.hasBeenUsed = true;
            });
            step.products[step.productKeys[0]] = {
              ingredients: productIngredients,
              dishes: [],
              sourceStepType: STEP_TYPES.STIR
            };
          } 
        } else {
          //error: no ingredientType
          ErrorService.logError({
            message: "Stir Step Service ERROR: no ingredientType found for input in function 'instantiateStep'",
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
              step.ingredientsToStir = referencedStep.products[input.key].ingredients;
              if(!step.products) {
                step.products = {};
              }
              var productIngredients = _.forEach(angular.copy(step.ingredientsToStir), function(ingredient) {
                ingredient.hasBeenUsed = true;
              });
              step.products[step.productKeys[0]] = {
                ingredients: productIngredients,
                dishes: referencedStep.products[input.key].dishes,
                sourceStepType: STEP_TYPES.STIR
              };
            } else {
              //error - no products for found step
              console.log("stirStepService error: no products for referencedStep: ", referencedStep);
              ErrorService.logError({
                message: "Stir Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } 
        } else {
          //error - no step found
          ErrorService.logError({
            message: "Stir Step Service ERROR: no step found for input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("stirStepService error: unexpected sourceType: ", input);
        ErrorService.logError({
          message: "Stir Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
          input: input,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //set isEmpty
    if(step.ingredientsToStir.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set tip
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToStir);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var whenToStir = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "whenToStir";
      }).val;
      var stirType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "stirType";
      }).val;
      var stepText = stirType + " ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToStir);
      for (var i = step.ingredientsToStir.length - 1; i >= 0; i--) {
        if(!step.ingredientsToStir[i].nameFormFlag) {
          step.ingredientsToStir[i].nameFormFlag = "standardForm";
        }
      }

      switch(step.ingredientsToStir.length) {
        case 0:
          //error
          ErrorService.logError({
            message: "Stir Step Service ERROR: no ingredients to stir in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToStir[0].prefix + " " + step.ingredientsToStir[0].name[step.ingredientsToStir[0].nameFormFlag].toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToStir[0].prefix + " " + step.ingredientsToStir[0].name[step.ingredientsToStir[0].nameFormFlag].toLowerCase() + " and " + step.ingredientsToStir[1].prefix + " " + step.ingredientsToStir[1].name[step.ingredientsToStir[1].nameFormFlag].toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToStir.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToStir[i].prefix + " " + step.ingredientsToStir[i].name[step.ingredientsToStir[i].nameFormFlag].toLowerCase();
            } else {
              stepText += step.ingredientsToStir[i].prefix + " " + step.ingredientsToStir[i].name[step.ingredientsToStir[i].nameFormFlag].toLowerCase() + ", ";
            }
          }
          break;
      }
      stepText += " " + whenToStir;
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

  service.constructAuxiliaryStep = function(step, ingredients) {
    var whenToStir = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "whenToStir";
    }).val;
    var stirType = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "stirType";
    }).val;
    var auxStepText = stirType + " the ";
    switch(ingredients.length) {
      case 0:
        //error
        ErrorService.logError({
          message: "Stir Step Service ERROR: no ingredients for aux step construction in function 'constructAuxiliaryStep'",
          step: step
        });
        ErrorService.showErrorAlert();
        break;

      case 1:
        auxStepText += ingredients[0].name[ingredients[0].nameFormFlag].toLowerCase();
        break;

      case 2:
        auxStepText += ingredients[0].name[ingredients[0].nameFormFlag].toLowerCase() + " and " + ingredients[1].name[ingredients[0].nameFormFlag].toLowerCase();
        break;

      default:
        for (var i = ingredients.length - 1; i >= 0; i--) {
          if(i === 0) {
            auxStepText += "and " + ingredients[i].name[ingredients[i].nameFormFlag].toLowerCase();
          } else {
            auxStepText += ingredients[i].name[ingredients[i].nameFormFlag].toLowerCase() + ", ";
          }
        }
        break;
    }
    auxStepText += " " + whenToStir + ".";
    step.text = auxStepText;
  };

  return service;
}]);
