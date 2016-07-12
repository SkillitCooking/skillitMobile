'use strict';
angular.module('main')
.factory('boilStepService', ['_', 'StepTipService', 'DishInputService', function (_, StepTipService, DishInputService) {
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
                  step.ingredientsToBoil = step.ingredientsToBoil.concat(concatIngredients);
                  if(!step.products) {
                    step.products = {};
                    step.products[step.productKeys[0]] = {
                      ingredients: []
                    };
                  }
                  step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(step.ingredientsToBoil);
                }
              } else {
                //then ingredientType not found, throw error
                console.log("Boil step service Error: no ingredientType found for input key", input);
              }
              break;

            case "StepProduct":
              var referencedStep = _.find(recipe.stepList, function(iterStep) {
                return iterStep.stepId === input.sourceId;
              });
              if(referencedStep) {
                if(!referencedStep.isEmpty) {
                  if(referencedStep.products){
                    step.ingredientsToBoil = step.ingredientsToBoil.concat(referencedStep.products[input.key].ingredients);
                    if(!step.products) {
                      step.products = {};
                      step.products[step.productKeys[0]] = {
                        ingredients: []
                      };
                    }
                    step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(step.ingredientsToBoil);
                  } else {
                    //then no products for referencedStep, throw error
                    console.log("Boil step service Error: no products for referencedStep", referencedStep);
                  }
                }
              } else {
                //then referenced step not found, throw error
                console.log("boil step service Error: step via sourceId couldn't be located");
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
              if(!step.products){
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].dishes = [step.boilingDish];
            } else {
              //then dish not found - throw error
              console.log("Boil step service Error: dish not found in equipmentList", input);
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
                  //will possibly want to make more general in the future
                  if(!step.products){
                    step.products = {};
                    step.products[step.productKeys[0]] = {
                      ingredients: []
                    };
                  }
                  step.products[step.productKeys[0]].dishes = [step.boilingDish];
                } else {
                  //then no products for referencedStep, throw error
                  console.log("Boil step service Error: no products for referencedStep", referencedStep);
                }
              } else if(step.ingredientsToBoil && step.ingredientsToBoil.length > 0) {
                var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
                if(originalDishProducts) {
                  var dishKey = DishInputService.getDishKey(step.stepType);
                  if(originalDishProducts[dishKey]) {
                    step.boilingDish = originalDishProducts[dishKey].dishes[0];
                  } else {
                    if(originalDishProducts.dishes && originalDishProducts.dishes.length > 0) {
                      //then came from equipmentList
                      step.boilingDish = originalDishProducts.dishes[0];
                    }
                  }
                  if (!step.products) {
                    step.products = {};
                    step.products[step.productKeys[0]] = {
                      ingredients: []
                    };
                  }
                  step.products[step.productKeys[0]].dishes = [step.boilingDish];
                } else {
                  //error
                  console.log("boilStepService error: cannot trace boilingDish", step);
                }
              }
            } else {
              //then step couldn't be found, throw error
              console.log("Boil step service Error: step via sourceId couldn't be located");
            }
            break;

          default: 
            //unexpected sourceType then
            console.log("Boil step service Error: unexpected sourceType for dishInput: ", input.sourceType);
        }
      } else {
        //log error
        console.log("Boil step service error: unexpect inputName: ", inputName);
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
      var stepText = "Boil the ";
      switch (step.ingredientsToBoil.length){
        case 0:
          //error
          stepText = "NO INGREDIENTS TO BOIL";
          console.log("Boil step service Error: no ingredientsToBoil in step: ", step);
          break;

        case 1:
          stepText += step.ingredientsToBoil[0].name.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToBoil[0].name.toLowerCase() + " and " + step.ingredientsToBoil[1].name.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToBoil.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToBoil[i].name.toLowerCase();
            } else {
              stepText += step.ingredientsToBoil[i].name.toLowerCase() + ", ";
            }
          }
          break;
      }
      if(step.boilingDish.name !== "Default") {
        stepText += " in the " + step.boilingDish.name.toLowerCase();
      }
      if(cookAccordingToInstructions){
        stepText += " according to package instructions";
      } else if(boilingDuration){
        stepText += " " + boilingDuration;
      } else {
        //no boiling duration and not according to instructions error
        console.log("boil step service error: no boiling duration where expected");
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
