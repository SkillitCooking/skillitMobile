'use strict';
angular.module('main')
.factory('placeStepService', ['_', 'StepTipService', 'DishInputService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, DishInputService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  //ingredientInputs ==> ingredientsToPlace
  //dishProductInput ==> dishToPlaceOn, alreadyPlacedIngredients
  function instantiateStep(step, recipe) {
    step.ingredientsToPlace = [];
    step.alreadyPlacedIngredients = [];
    var ingredientInputs = step.stepInputs["ingredientInputs"];
    var dishProductInput = step.stepInputs["dishProductInput"];
    //get ingredientInputs
    for (var i = ingredientInputs.length - 1; i >= 0; i--) {
      var input = ingredientInputs[i];
      switch(input.sourceType) {
        case "IngredientList":
          var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
            return type.typeName === input.key;
          });
          if(ingredientType) {
            if(ingredientType.ingredients.length > 0) {
              var concatIngredients = _.filter(ingredientType.ingredients, function(ingredient){
                return ingredient.useInRecipe;
              });
              step.ingredientsToPlace = step.ingredientsToPlace.concat(concatIngredients);
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.PLACE
                };
              }
              //may need to instantiate ingredients...
              //erase transformation prefix for future steps that used the Place steps products
              //But keep for current step 
              var productIngredients = angular.copy(concatIngredients);
              _.forEach(productIngredients, function(ingredient) {
                ingredient.transformationPrefix = "";
                ingredient.hasBeenUsed = true;
              });
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
            }
          } else {
            //error: no ingredientType for the input
            ErrorService.logError({
              message: "Place Step Service ERROR: no ingredientType found for input key in function 'instantiateStep'",
              input: input,
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function (iterStep){
            return iterStep.stepId === input.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products) {
                step.ingredientsToPlace = step.ingredientsToPlace.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: [],
                    sourceStepType: STEP_TYPES.PLACE
                  };
                }
                var productIngredients = angular.copy(referencedStep.products[input.key].ingredients);
                _.forEach(productIngredients, function(ingredient) {
                  ingredient.transformationPrefix = "";
                  ingredient.hasBeenUsed = true;
                });
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
              } else {
                //error: then no products for step
                ErrorService.logError({
                  message: "Place Step Service ERROR: no products for referenced step in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            }
          } else {
            //error: then no step found
            ErrorService.logError({
              message: "Place Step Service ERROR: no step found for input in function 'instantiateStep'",
              input: input,
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        default:
          //error unexpected sourceType
          ErrorService.logError({
            message: "Place Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
          break;
      }
    }
    //get dishProductInput
    switch(dishProductInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishProductInput.key;
        });
        if(dish) {
          step.dishToPlaceOn = dish;
          step.dishCameFromProduct = false;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: [],
              sourceStepType: STEP_TYPES.PLACE
            };
          }
          step.products[step.productKeys[0]].dishes = [step.dishToPlaceOn];
        } else {
          //error: no dish found
          ErrorService.logError({
            message: "Place Step Service ERROR: no dish found for input in function 'instantiateStep'",
            dishProductInput: dishProductInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === dishProductInput.sourceId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.dishToPlaceOn = referencedStep.products[dishProductInput.key].dishes[0];
              step.alreadyPlacedIngredients = referencedStep.products[dishProductInput.key].ingredients;
              var productIngredients = angular.copy(step.alreadyPlacedIngredients);
              _.forEach(productIngredients, function(ingredient) {
                ingredient.transformationPrefix = "";
              });
              step.dishCameFromProduct = true;
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.PLACE
                };
              }
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
              step.products[step.productKeys[0]].dishes = [step.dishToPlaceOn];
            } else {
              //error - no products for step
              ErrorService.logError({
                message: "Place Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } else if(step.ingredientsToPlace && step.ingredientsToPlace.length > 0) {
            //dishInput check here
            var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
            if(originalDishProducts) {
              var dishKey = DishInputService.getDishKey(step.stepType);
              if(originalDishProducts[dishKey]) {
                //then came from stepProduct
                step.dishToPlaceOn = originalDishProducts[dishKey].dishes[0];
                step.alreadyPlacedIngredients = originalDishProducts[dishKey].ingredients;
                step.dishCameFromProduct = true;
              } else {
                if(originalDishProducts.dishes && originalDishProducts.dishes.length > 0) {
                  //then came from equipmentList
                  step.dishToPlaceOn = originalDishProducts.dishes[0];
                  step.alreadyPlacedIngredients = originalDishProducts.ingredients;
                  step.dishCameFromProduct = false;
                } 
              }
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.PLACE
                };
              }
              var productIngredients = angular.copy(step.alreadyPlacedIngredients);
                _.forEach(productIngredients, function(ingredient) {
                  ingredient.transformationPrefix = "";
                });
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
              step.products[step.productKeys[0]].dishes = [step.dishToPlaceOn];
            } else {
              //error
              ErrorService.logError({
                message: "Place Step Service ERROR: cannot trace dishToPlaceOn for step with ingredientsToPlace in function 'instantiateStep'",
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          }
        } else {
          //error then step couldn't be located
          ErrorService.logError({
            message: "Place Step Service ERROR: step could not be found from input in function 'instantiateStep'",
            dishProductInput: dishProductInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("placeStepService error: unexpected sourceType from input: ", dishProductInput);
        ErrorService.logError({
          message: "Place Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
          dishProductInput: dishProductInput,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //isEmpty condition
    if(step.ingredientsToPlace.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set StepTips
    //Do we want to conflate the two types of ingredients for issuing a stepList?
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToPlace.concat(step.alreadyPlacedIngredients));
    }
  }

  function constructStepText(step) {
    console.log('step', step);
    if(!step.isEmpty) {
      var placeType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "placeType";
      }).val;
      var placeModifier = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "placeModifier";
      }).val;
      var stepText = placeType + " ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToPlace);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToPlace);
      GeneralTextService.assignIngredientDisplayNames(step.alreadyPlacedIngredients);

      switch(step.ingredientsToPlace.length) {
        case 0:
          //error
          ErrorService.logError({
            message: "Place Step Service ERROR: ingredientsToPlace in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToPlace[0].prefix + " " + step.ingredientsToPlace[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToPlace[0].prefix + " " + step.ingredientsToPlace[0].displayName.toLowerCase() + " and " + step.ingredientsToPlace[1].prefix + " " + step.ingredientsToPlace[1].displayName.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToPlace.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToPlace[i].prefix + " " + step.ingredientsToPlace[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToPlace[i].prefix + " " + step.ingredientsToPlace[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      //check for default dish
      if(step.dishToPlaceOn.name === 'Default') {

      } else {
      switch(placeType) {
        case "Add":
          stepText += " to ";
          break;
        case "Combine":
        case "Mix":
          stepText += " in ";
          break;
        case "Place":
        case "Plate":
          stepText += " on ";
          break;
        default:
          //error - unexpected placeType
          ErrorService.logError({
            message: "Place Step Service ERROR: unexpected placeType in function 'constructStepText'",
            placeType: placeType,
            step: step
          });
          ErrorService.showErrorAlert();
          break;
      }
      if(step.alreadyPlacedIngredients.length > 0) {
        stepText += "the ";
      } else {
        stepText += "a ";
      }
      stepText += step.dishToPlaceOn.name.toLowerCase();
      switch(step.alreadyPlacedIngredients.length) {
        case 0:
          break;

        case 1:
          stepText += " with the " + step.alreadyPlacedIngredients[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += " with the " + step.alreadyPlacedIngredients[0].displayName.toLowerCase() + " and " +
            step.alreadyPlacedIngredients[1].displayName.toLowerCase();
          break;

        default:
          stepText += " with the ";
          for (var i = step.alreadyPlacedIngredients.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.alreadyPlacedIngredients[i].displayName.toLowerCase();
            } else {
              stepText += step.alreadyPlacedIngredients[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      }
      if(placeModifier !== "") {
        stepText += " and " + placeModifier;
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

  return service;
}]);
