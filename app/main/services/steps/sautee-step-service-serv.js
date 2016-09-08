'use strict';
angular.module('main')
.factory('sauteeStepService', ['_', 'stirStepService', 'StepTipService', 'DishInputService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', 
  function (_, stirStepService, StepTipService, DishInputService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    step.ingredientsToSautee = [];
    var ingredientInputs = step.stepInputs["ingredientInputs"];
    var dishInput = step.stepInputs["dishInput"];
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
              step.ingredientsToSautee = step.ingredientsToSautee.concat(concatIngredients);
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.SAUTEE
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
            //error - no type found
            console.log("sauteeStepService error: could not find ingredientType for input: ", input);
            ErrorService.logError({
              message: "Sautee Step Service ERROR: no ingredientType found for input in function 'instantiateStep'",
              input: input,
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function (iterStep) {
            return iterStep.stepId === input.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products){
                step.ingredientsToSautee = step.ingredientsToSautee.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: [],
                    sourceStepType: STEP_TYPES.SAUTEE
                  };
                }
                var productIngredients = angular.copy(referencedStep.products[input.key].ingredients);
                _.forEach(productIngredients, function(ingredient) {
                  ingredient.transformationPrefix = "";
                  ingredient.hasBeenUsed = true;
                });
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
              } else {
                //error: no products for referenced step
                ErrorService.logError({
                  message: "Sautee Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            }
          } else {
            //error: can't find referenced step
            ErrorService.logError({
              message: "Sautee Step Service ERROR: can't find step from input in function 'instantiateStep'",
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
            message: "Sautee Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
          break;
      }
    }
    //dishInput
    switch(dishInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishInput.key;
        });
        if(dish) {
          step.sauteeDish = dish;
          step.dishCameFromProduct = false;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: [],
              sourceStepType: STEP_TYPES.SAUTEE
            };
          }
          step.products[step.productKeys[0]].dishes = [step.sauteeDish];
        } else {
          //error - dish not found
          ErrorService.logError({
            message: "Dry Step Service ERROR: dish not found for input in function 'instantiateStep'",
            dishInput: dishInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === dishInput.sourceId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.sauteeDish = referencedStep.products[dishInput.key].dishes[0];
              step.dishCameFromProduct = true;
              if(!step.products){
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.SAUTEE
                };
              }
              step.products[step.productKeys[0]].dishes = [step.sauteeDish];
            } else {
              //error - cannot find products for step
              ErrorService.logError({
                message: "Sautee Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } else if(step.ingredientsToSautee && step.ingredientsToSautee.length > 0) {
            var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
            if(originalDishProducts) {
              var dishKey = DishInputService.getDishKey(step.stepType);
              if(originalDishProducts[dishKey]) {
                //Then came from stepProduct
                step.sauteeDish = originalDishProducts[dishKey].dishes[0];
                step.dishCameFromProduct = true;
              } else {
                if(originalDishProducts.dishes && originalDishProducts.dishes.length) {
                  step.sauteeDish = originalDishProducts.dishes[0];
                  step.dishCameFromProduct = false;
                }
              }
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.SAUTEE
                };
              }
              step.products[step.productKeys[0]].dishes = [step.sauteeDish];
            } else {
              //error
              ErrorService.logError({
                message: "Sautee Step Service ERROR: cannot trace sauteeDish in function 'instantiateStep'",
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          }
        } else {
          //error - cannot find step from input
          console.log("sauteeStepService error: cannot find step from input: ", dishInput);
          ErrorService.logError({
            message: "Sautee Step Service ERROR: cannot find step from input in function 'instantiateStep'",
            dishInput: dishInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error - unexpected input type
        ErrorService.logError({
          message: "Sautee Step Service ERROR: unexpected dishInput type in function 'instantiateStep'",
          dishInput: dishInput,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //set isEmpty condition
    if(step.ingredientsToSautee.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set StepTips
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToSautee);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var sauteeDuration = _.find(step.stepSpecifics, function (specific) {
        return specific.propName === "sauteeDuration";
      }).val;
      var stepText = "Sautee ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToSautee);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToSautee);

      switch(step.ingredientsToSautee.length) {
        case 0:
          //error
          ErrorService.logError({
            message: "Sautee Step Service ERROR: no ingredientType found for input key in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToSautee[0].prefix + " " + step.ingredientsToSautee[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToSautee[0].prefix + " " + step.ingredientsToSautee[0].displayName.toLowerCase() + " and " + step.ingredientsToSautee[1].prefix + " " + step.ingredientsToSautee[1].displayName.toLowerCase();
          break;

        default: 
          for (var i = step.ingredientsToSautee.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToSautee[i].prefix + " " + step.ingredientsToSautee[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToSautee[i].prefix + " " + step.ingredientsToSautee[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      stepText += " " + sauteeDuration + ".";
      step.text = stepText;
    }
  }

  function constructAuxiliarySteps(step) {
    if(!step.isEmpty) {
      for (var i = step.auxiliarySteps.length - 1; i >= 0; i--) {
        stirStepService.constructAuxiliaryStep(step.auxiliarySteps[i], step.ingredientsToSautee);
      }
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //construct step
    constructStepText(step);
    //auxiliary step handling
    if(step.auxiliarySteps && step.auxiliarySteps.length > 0){
      constructAuxiliarySteps(step);
    }
  };

  return service;
}]);
