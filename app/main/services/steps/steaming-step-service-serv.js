'use strict';
angular.module('main')
.factory('steamingStepService', ['_', 'StepTipService', 'DishInputService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, DishInputService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    step.ingredientsToSteam = [];
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
              step.ingredientsToSteam = step.ingredientsToSteam.concat(concatIngredients);
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.STEAM
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
              message: "Steaming Step Service ERROR: no ingredientType found for input in function 'instantiateStep'",
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
              if(referencedStep.products){
                step.ingredientsToSteam = step.ingredientsToSteam.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: [],
                    sourceStepType: STEP_TYPES.STEAM
                  };
                }
                var productIngredients = angular.copy(referencedStep.products[input.key].ingredients);
                _.forEach(productIngredients, function(ingredient) {
                  ingredient.transformationPrefix = "";
                  ingredient.hasBeenUsed = true;
                });
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
              } else {
                //error - no products for referencedStep
                console.log("steamingStepService error: no products for referencedStep: ", input);
                ErrorService.logError({
                  message: "Steaming Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            }
          } else {
            //error - couldn't find step
            console.log("steamingStepService error: can't find step for input: ", input);
            ErrorService.logError({
              message: "Steaming Step Service ERROR: can't find step for input in function 'instantiateStep'",
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
            message: "Steaming Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
          break;
      }
    }
    //get dishes
    switch(dishInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishInput.key;
        });
        if(dish) {
          step.steamingDish = dish;
          step.dishCameFromProduct = false;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: [],
              sourceStepType: STEP_TYPES.STEAM
            };
          }
          step.products[step.productKeys[0]].dishes = [step.steamingDish];
        } else {
          //error - no dish found
          ErrorService.logError({
            message: "Steaming Step Service ERROR: no dish found from input in function 'instantiateStep'",
            dishInput: dishInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return dishInput.sourceId === iterStep.stepId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products) {
              step.steamingDish = referencedStep.products[dishInput.key].dishes[0];
              step.dishCameFromProduct = true;
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.STEAM
                };
              }
              step.products[step.productKeys[0]].dishes = [step.steamingDish];
            } else {
              //error - no products for step
              console.log("steamingStepService error: no products for referencedStep", dishInput);
              ErrorService.logError({
                message: "Steaming Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } else if(step.ingredientsToSteam && step.ingredientsToSteam.length > 0) {
            var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
            if(originalDishProducts) {
              var dishKey = DishInputService.getDishKey(step.stepType);
              if(originalDishProducts[dishKey]) {
                //then came from stepProduct
                step.steamingDish = originalDishProducts[dishKey].dishes[0];
                step.dishCameFromProduct = true;
              } else {
                if(originalDishProducts.dishes && originalDishProducts.dishes.length > 0) {
                  //then came from EquipmentList
                  step.steamingDish = originalDishProducts.dishes[0];
                  step.dishCameFromProduct = false;
                }
              }
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.STEAM
                };
              }
              step.products[step.productKeys[0]].dishes = [step.steamingDish];
            } else {
              //error
              ErrorService.logError({
                message: "Steaming Step Service ERROR: cannot trace steamingDish for step in function 'instantiateStep'",
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          }
        } else {
          //error - no step found
          ErrorService.logError({
            message: "Steam Step Service ERROR: no step found for input in function 'instantiateStep'",
            dishInput: dishInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error - unexpected sourceType
        ErrorService.logError({
          message: "Steaming Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
          dishInput: dishInput,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //check isEmpty condition
    if(step.ingredientsToSteam.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToSteam);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var steamingDuration = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "steamingDuration";
      }).val;
      var stepText = "Steam ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToSteam);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToSteam);

      switch(step.ingredientsToSteam.length) {
        case 0:
          //error - no ingredients
          stepText = "NO INGREDIENTS TO STEAM";
          ErrorService.logError({
            message: "Steaming Step Service ERROR: no ingredients to steam in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToSteam[0].prefix + " " + step.ingredientsToSteam[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToSteam[0].prefix + " " + step.ingredientsToSteam[0].displayName.toLowerCase() + " and " + step.ingredientsToSteam[1].prefix + " " + step.ingredientsToSteam[1].displayName.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToSteam.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToSteam[i].prefix + " " + step.ingredientsToSteam[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToSteam[i].prefix + " " + step.ingredientsToSteam[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      if(step.steamingDish.name !== 'Default') {
        if(step.dishCameFromProduct) {
          stepText += " in the " + step.steamingDish.name.toLowerCase();
        } else {
          stepText += " in a " + step.steamingDish.name.toLowerCase();
        }
      }
      stepText += " " + steamingDuration;
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiateStep
    instantiateStep(step, recipe);
    //construct step
    constructStepText(step);
  };

  return service;
}]);
