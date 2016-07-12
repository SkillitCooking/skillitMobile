'use strict';
angular.module('main')
.factory('cookStepService', ['_', 'StepTipService', 'DishInputService', function (_, StepTipService, DishInputService) {
  var service = {};

  function instantiateStep(step, recipe) {
    step.ingredientsToCook =[];
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
                concatIngredients = _.filter(ingredientType.ingredients, function(ingredient) {
                  return ingredient.useInRecipe;
                });
              }
              step.ingredientsToCook = step.ingredientsToCook.concat(concatIngredients);
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
            console.log("cookStepService error: could not find ingredientType for input: ", input);
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === input.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products) {
                step.ingredientsToCook = step.ingredientsToCook.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: []
                  };
                }
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(referencedStep.products[input.key].ingredients);
              } else {
                //error: no products for referenced step
                console.log("cookStepService error: no products for referencedStep: ", referencedStep);
              }
            }
          } else {
            //error - can't find referenced step
            console.log("cookStepService error: can't find step from input: ", input);
          }
          break;

        default:
          //error - unexpected sourceType
          console.log("cookStepService error: unexpected sourceType: ", dishInput);
      }
    }
    //dishInput
    switch(dishInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishInput.key;
        });
        if(dish) {
          step.cookingDish = dish;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: []
            };
          }
          step.products[step.productKeys[0]].dishes = [step.cookingDish];
        } else {
          //error - dish not found
          console.log("cookStepService error: dish not found for input: ", dishInput);
        }
        break;
      
      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === dishInput.sourceId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products) {
              step.cookingDish = referencedStep.products[dishInput.key].dishes[0];
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].dishes = [step.cookingDish];
            } else {
              //error - no products for referencedStep
              console.log("cookStepService error: no products for referencedStep: ", referencedStep);
            }
          } else if(step.ingredientsToCook && step.ingredientsToCook.length > 0) {
            var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
            if(originalDishProducts) {
              var dishKey = DishInputService.getDishKey(step.stepType);
              if(originalDishProducts[dishKey]) {
                step.cookingDish = originalDishProducts.dishes[0];
              } else {
                if(originalDishProducts.dishes && originalDishProducts.dishes.length > 0) {
                  step.cookingDish = originalDishProducts.dishes[0];
                }
              }
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].dishes = [step.cookingDish];
            } else {
              //error
              console.log("cookStepService error: cannot trace cookingDish: ", step);
            }
          }
        } else {
          //error - cannot find referenced step from input
          console.log("cookStepService error: cannot find step from input: ", dishInput);
        }
        break;

      default:
        //error - unexpected sourceType for dishInput
        console.log("cookStepService error: unexpected sourceType for input: ", dishInput);
        break;
    }
    //set isEmpty condition
    if(step.ingredientsToCook.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set StepTips
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToCook);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var cookType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "cookType";
      }).val;
      var cookDuration = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "cookDuration";
      }).val;
      var cookAccordingToInstructions = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "cookAccordingToInstructions";
      }).val;

      var stepText = cookType + " the ";
      switch(step.ingredientsToCook.length) {
        case 0:
          //error
          stepText = "NO INGREDIENTS TO COOK";
          console.log("cookStepService error: no ingredientsToCook in step: ", step);
          break;

        case 1:
          stepText += step.ingredientsToCook[0].name.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToCook[0].name.toLowerCase() + " and " + step.ingredientsToCook[1].name.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToCook.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToCook[i].name.toLowerCase();
            } else {
              stepText += step.ingredientsToCook[i].name.toLowerCase() + ", ";
            }
          }
          break;
      }
      if(step.cookingDish.name !== 'Default') {
        stepText += " in the " + step.cookingDish.name.toLowerCase();
      }
      if(cookAccordingToInstructions) {
        stepText += " according to package instructions";
      } else if(cookDuration) {
        stepText += " " + cookDuration;
      } else {
        //error - no cooking duration and not according to package instructions either
        console.log("cookStepService error: no cookingDuration nor cookAccordingToInstructions");
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
