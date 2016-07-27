'use strict';
angular.module('main')
.factory('sauteeStepService', ['_', 'stirStepService', 'StepTipService', 'DishInputService',
  function (_, stirStepService, StepTipService, DishInputService) {
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
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(concatIngredients);
            }
          } else {
            //error - no type found
            console.log("sauteeStepService error: could not find ingredientType for input: ", input);
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
                    ingredients: []
                  };
                }
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(referencedStep.products[input.key].ingredients);
              } else {
                //error: no products for referenced step
                console.log("sauteeStepService error: no products for referencedStep: ", referencedStep);
              }
            }
          } else {
            //error: can't find referenced step
            console.log("sauteeStepService error: can't find step from input: ", input);
          }
          break;

        default:
          //error - unexpected sourceType
          console.log("sauteeStepService error: unexpected sourceType: ", input);
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
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: []
            };
          }
          step.products[step.productKeys[0]].dishes = [step.sauteeDish];
        } else {
          //error - dish not found
          console.log("sauteeStepService error: dish not found for input: ", dishInput);
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
              if(!step.products){
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].dishes = [step.sauteeDish];
            } else {
              //error - cannot find products for step
              console.log("sauteeStepService error: no products for referencedStep: ", referencedStep);
            }
          } else if(step.ingredientsToSautee && step.ingredientsToSautee.length > 0) {
            var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
            if(originalDishProducts) {
              var dishKey = DishInputService.getDishKey(step.stepType);
              if(originalDishProducts[dishKey]) {
                step.sauteeDish = originalDishProducts[dishKey].dishes[0];
              } else {
                if(originalDishProducts.dishes && originalDishProducts.dishes.length) {
                  step.sauteeDish = originalDishProducts.dishes[0];
                }
              }
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].dishes = [step.sauteeDish];
            } else {
              //error
              console.log("sauteeStepService error: cannot trace sauteeDish: ", step);
            }
          }
        } else {
          //error - cannot find step from input
          console.log("sauteeStepService error: cannot find step from input: ", dishInput);
        }
        break;

      default:
        //error - unexpected input type
        console.log("sauteeStepService error: unexpected dishInput type from input: ", dishInput);
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
      var stepText = "Sautee the ";
      switch(step.ingredientsToSautee.length) {
        case 0:
          //error
          console.log("sauteeStepService error: no ingredientsToSautee: ", step);
          stepText = "NO INGREDIENTS TO SAUTEE";
          break;

        case 1:
          stepText += step.ingredientsToSautee[0].name.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToSautee[0].name.toLowerCase() + " and " + step.ingredientsToSautee[1].name.toLowerCase();
          break;

        default: 
          for (var i = step.ingredientsToSautee.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToSautee[i].name.toLowerCase();
            } else {
              stepText += step.ingredientsToSautee[i].name.toLowerCase() + ", ";
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
