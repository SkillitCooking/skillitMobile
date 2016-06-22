'use strict';
angular.module('main')
.service('stirStepService', ['_', 'StepTipService', function (_, StepTipService) {
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
            step.products[step.productKeys[0]] = {
              ingredients: concatIngredients,
              dishes: []
            };
            step.isEmpty = false;
          } else {
            step.isEmpty = true;
          }
        } else {
          //error: no ingredientType
          console.log("stirStepService error: ingredientType not found from input: ", input);
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
              if(!products) {
                step.products = {};
              }
              step.products[step.productKeys[0]] = {
                ingredients: step.ingredientsToStir,
                dishes: referencedStep.products[input.key].dishes
              };
              step.isEmpty = false;
            } else {
              //error - no products for found step
              console.log("stirStepService error: no products for referencedStep: ", referencedStep);
            }
          } else {
            step.isEmpty = true;
          }
        } else {
          //error - no step found
          console.log("stirStepService error: no step found for input: ", input);
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("stirStepService error: unexpected sourceType: ", input);
        break;
    }
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
      var stepText = stirType;
      switch(step.ingredientsToStir.length) {
        case 0:
          //error
          stepText = "NO INGREDIENTS TO STIR";
          console.log("stirStepService error: no ingredients to stir");
          break;

        case 1:
          stepText += " the " + step.ingredientsToStir[0].name.toLowerCase();
          break;

        case 2:
          stepText += " the " + step.ingredientsToStir[0].name.toLowerCase() + " and " + step.ingredientsToStir[1].name.toLowerCase();
          break;

        default:
          stepText += " the ";
          for (var i = step.ingredientsToStir.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToStir[i].name.toLowerCase();
            } else {
              stepText += step.ingredientsToStir[i].name.toLowerCase() + ", ";
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
        auxStepText = "NO INGREDIENTS GIVEN FOR AUX STEP CONSTRUCTION";
        console.log("stirStepService error: no ingredients for aux step construction");
        break;

      case 1:
        auxStepText += ingredients[0].name.toLowerCase();
        break;

      case 2:
        auxStepText += ingredients[0].name.toLowerCase() + " and " + ingredients[1].name.toLowerCase();
        break;

      default:
        for (var i = ingredients.length - 1; i >= 0; i--) {
          if(i === 0) {
            auxStepText += "and " + ingredients[i].name.toLowerCase();
          } else {
            auxStepText += ingredients[i].name.toLowerCase() + ", ";
          }
        }
        break;
    }
    auxStepText += " " + whenToStir + ".";
    step.text = auxStepText;
  };

  return service;
}]);
