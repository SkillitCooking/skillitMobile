'use strict';
angular.module('main')
.factory('boilStepService', ['_', 'StepTipService', 'DishInputService', 'STEP_TYPES', 'GeneralTextService', 'ErrorService', function (_, StepTipService, DishInputService, STEP_TYPES, GeneralTextService, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    step.ingredientsToBoil = [];
    for(var inputName in step.stepInputs){
      if(inputName === "ingredientInputs"){
        //do not expect EquipmentList
        for (var i = step.stepInputs[inputName].length - 1; i >= 0; i--) {
          var input = step.stepInputs[inputName][i];
          switch(input.sourceType){
            case "IngredientList":
              var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
                return type.typeName === input.key;
              });
              if(ingredientType){
                if(ingredientType.ingredients.length > 0) {
                  var concatIngredients;
                  if(recipe.recipeType !== 'BYO') {
                    concatIngredients = ingredientType.ingredients;
                  } else {
                    concatIngredients = _.filter(ingredientType.ingredients, function(ingredient){
                      return ingredient.useInRecipe;
                    });
                  }
                  var productIngredients = angular.copy(concatIngredients);
                  _.forEach(productIngredients, function(ingredient) {
                    ingredient.transformationPrefix = "";
                    ingredient.hasBeenUsed = true;
                  });
                  step.ingredientsToBoil = step.ingredientsToBoil.concat(concatIngredients);
                  if(!step.products) {
                    step.products = {};
                    step.products[step.productKeys[0]] = {
                      ingredients: [],
                      sourceStepType: STEP_TYPES.BOIL
                    };
                  }
                  step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
                }
              } else {
                //then ingredientType not found, throw error
                ErrorService.logError({
                  message: "Boil Step Service ERROR: no ingredientType found for input key in function 'instantiateStep'",
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
                    var productIngredients = angular.copy(referencedStep.products[input.key].ingredients);
                    _.forEach(productIngredients, function(ingredient) {
                      ingredient.transformationPrefix = "";
                      ingredient.hasBeenUsed = true;
                    });
                    step.ingredientsToBoil = step.ingredientsToBoil.concat(referencedStep.products[input.key].ingredients);
                    if(!step.products) {
                      step.products = {};
                      step.products[step.productKeys[0]] = {
                        ingredients: [],
                        sourceStepType: STEP_TYPES.BOIL
                      };
                    }
                    step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(productIngredients);
                  } else {
                    //then no products for referencedStep, throw error
                    console.log("Boil step service Error: no products for referencedStep", referencedStep);
                    ErrorService.logError({
                      message: "Boil Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                      referencedStep: referencedStep,
                      step: step,
                      recipeName: recipe.name
                    });
                    ErrorService.showErrorAlert();
                  }
                }
              } else {
                //then referenced step not found, throw error
                console.log("boil step service Error: step via sourceId couldn't be located");
                ErrorService.logError({
                  message: "Boil Step Service ERROR: step via sourceId couldn't be located in function 'instantiateStep'",
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
              break;
          }
        }
        if(step.ingredientsToBoil.length === 0){
          //then no ingredients were picked up
          step.isEmpty = true;
        } else {
          //then step is not empty
          step.isEmpty = false;
        }
      } else if (inputName === "dishInput"){
        //do not expect IngredientList
        var input = step.stepInputs[inputName];
        switch(input.sourceType) {
          case "EquipmentList":
            var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
              return dish.name === input.key;
            });
            if(dish){
              step.boilingDish = dish;
              step.dishCameFromProduct = false;
              if(!step.products){
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  sourceStepType: STEP_TYPES.BOIL
                };
              }
              step.products[step.productKeys[0]].dishes = [step.boilingDish];
            } else {
              //then dish not found - throw error
                ErrorService.logError({
                  message: "Boil Step Service ERROR: dish not found in equipmentList in function 'instantiateStep'",
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
                  step.boilingDish = referencedStep.products[input.key].dishes[0];
                  step.dishCameFromProduct = true;
                  //will possibly want to make more general in the future
                  if(!step.products){
                    step.products = {};
                    step.products[step.productKeys[0]] = {
                      ingredients: [],
                      sourceStepType: STEP_TYPES.BOIL
                    };
                  }
                  step.products[step.productKeys[0]].dishes = [step.boilingDish];
                } else {
                  //then no products for referencedStep, throw error
                  console.log("Boil step service Error: no products for referencedStep", referencedStep);
                  ErrorService.logError({
                    message: "Boil Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                    referencedStep: referencedStep,
                    step: step,
                    recipeName: recipe.name
                  });
                  ErrorService.showErrorAlert();
                }
              } else if(step.ingredientsToBoil && step.ingredientsToBoil.length > 0) {
                var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
                if(originalDishProducts) {
                  var dishKey = DishInputService.getDishKey(step.stepType);
                  if(originalDishProducts[dishKey]) {
                    //then came from a stepProduct
                    step.boilingDish = originalDishProducts[dishKey].dishes[0];
                    step.dishCameFromProduct = true;
                  } else {
                    if(originalDishProducts.dishes && originalDishProducts.dishes.length > 0) {
                      //then came from equipmentList
                      step.boilingDish = originalDishProducts.dishes[0];
                      step.dishCameFromProduct = false;
                    }
                  }
                  if (!step.products) {
                    step.products = {};
                    step.products[step.productKeys[0]] = {
                      ingredients: [],
                      sourceStepType: STEP_TYPES.BOIL
                    };
                  }
                  step.products[step.productKeys[0]].dishes = [step.boilingDish];
                } else {
                  //error
                  ErrorService.logError({
                    message: "Boil Step Service ERROR: cannot trace boilingDish in function 'instantiateStep'",
                    step: step,
                    recipeName: recipe.name
                  });
                  ErrorService.showErrorAlert();
                }
              }
            } else {
              //then step couldn't be found, throw error
              console.log("Boil step service Error: step via sourceId couldn't be located");
              ErrorService.logError({
                message: "Boil Step Service ERROR: step via sourceId couldn't be located in function 'instantiateStep'",
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
            break;

          default: 
            //unexpected sourceType then
            console.log("Boil step service Error: unexpected sourceType for dishInput: ", input.sourceType);
              ErrorService.logError({
                message: "Boil Step Service ERROR: unexpected sourceType for dishInput in function 'instantiateStep'",
                sourceType: input.sourceType,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
        }
      } else {
        //log error
        console.log("Boil step service error: unexpect inputName: ", inputName);
        ErrorService.logError({
          message: "Boil Step Service ERROR: no ingredientType found for input key in function 'instantiateStep'",
          inputName: inputName,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
      }
    }
    //isEmpty check
    if(step.ingredientsToBoil.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set StepTips
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToBoil);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var boilingDuration = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "boilingDuration";
      }).val;
      var cookAccordingToInstructions = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "cookAccordingToInstructions";
      }).val;
      var stepText = "Boil ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToBoil);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToBoil);

      switch (step.ingredientsToBoil.length){
        case 0:
          //error
          ErrorService.logError({
            message: "Boil Step Service ERROR: no ingredientsToBoil in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToBoil[0].prefix + " " + step.ingredientsToBoil[0].displayName.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToBoil[0].prefix + " " + step.ingredientsToBoil[0].displayName.toLowerCase() + " and " + step.ingredientsToBoil[1].prefix + " " + step.ingredientsToBoil[1].displayName.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToBoil.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToBoil[i].prefix + " " + step.ingredientsToBoil[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToBoil[i].prefix + " " + step.ingredientsToBoil[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      /*if(step.boilingDish.name !== "Default") {
        stepText += " in the " + step.boilingDish.name.toLowerCase();
      }*/
      if(cookAccordingToInstructions){
        stepText += " according to package instructions";
      } else if(boilingDuration){
        stepText += " " + boilingDuration;
      } else {
        //no boiling duration and not according to instructions error
        console.log("boil step service error: no boiling duration where expected");
        ErrorService.logError({
          message: "Boil Step Service ERROR: no boiling duration where expected in function 'constructStepText'",
          step: step
        });
        ErrorService.showErrorAlert();
      }
      step.text = stepText;
    }
  }
  


  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiateStep
    instantiateStep(step, recipe);
    //constructStep
    constructStepText(step);
  };

  return service;
}]);
