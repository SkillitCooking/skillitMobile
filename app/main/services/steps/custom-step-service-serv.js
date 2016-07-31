'use strict';
angular.module('main')
.factory('customStepService', ['_', 'StepTipService', 'DishInputService', 'ErrorService', function (_, StepTipService, DishInputService, ErrorService) {
  var service = {};

  function instantiateStep (step, recipe) {
    //not doing anything with inputs currently...
    //instantiate later with more time
    //now, just set up products with a pass along
    var ingredientInputs;
    var dishInputs;
    if(step && step.stepInputs) {
      ingredientInputs = step.stepInputs["ingredientInputs"];
      dishInputs = step.stepInputs["dishInputs"];
    }
    //ingredients
    if(!ingredientInputs){
      ingredientInputs = [];
    }
    if(!dishInputs) {
      dishInputs = [];
    }
    for (var i = ingredientInputs.length - 1; i >= 0; i--) {
      var ingredientInput = ingredientInputs[i];
      switch(ingredientInput.sourceType) {
        case "IngredientList":
          var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
            return type.typeName === ingredientInput.key;
          });
          if(ingredientType) {
            if(ingredientType.ingredients.length > 0) {
              if(!step.products){
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  dishes: []
                };
              }
              var concatIngredients;
              if(recipe.recipeType !== 'BYO') {
                concatIngredients = ingredientType.ingredients;
              } else {
                concatIngredients = _.filter(ingredientType.ingredients, function(ingredient) {
                  return ingredient.useInRecipe;
                });
              }
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(concatIngredients);
            }
          } else {
            //error
            ErrorService.logError({
              message: "Custom Step Service ERROR: no type found for input in function 'instantiateStep'",
              ingredientInput: ingredientInput,
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === ingredientInput.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products) {
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: [],
                    dishes: []
                  };
                }
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(referencedStep.products[ingredientInput.key].ingredients);
              } else {
                //error
                console.log("customStepService error: no products for referencedStep: ", referencedStep);
                ErrorService.logError({
                  message: "Custom Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            }
          } else {
            //error
            console.log("customStepService error: no step found for input: ", ingredientInput);
            ErrorService.logError({
              message: "Custom Step Service ERROR: no step found for input in function 'instantiateStep'",
              ingredientInput: ingredientInput,
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        default:
          //error
          ErrorService.logError({
            message: "Boil Step Service ERROR: no ingredientType found for input key in function 'instantiateStep'",
            ingredientInput: ingredientInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
          break;
      }
    }
    //dishes
    for (var i = dishInputs.length - 1; i >= 0; i--) {
      var dishInput = dishInputs[i];
      switch(dishInput.sourceType) {
        case "EquipmentList":
          var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
            return dish.name === dishInput.key;
          });
          if(dish) {
            if(!step.products) {
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: [],
                dishes: []
              };
            }
            step.products[step.productKeys[0]].dishes.push(dish);
          } else {
            //error
            console.log("customStepService error: no dish found for input: ", dishInput);
            ErrorService.logError({
              message: "Custom Step Service ERROR: no dish found for input in function 'instantiateStep'",
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
              if(referencedStep.products) {
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: [],
                    dishes: []
                  };
                }
                step.products[step.productKeys[0]].dishes.push(referencedStep.products[dishInput.key].dishes[0]);
              } else {
                //error
                ErrorService.logError({
                  message: "Custom Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            } else if(step.products[step.productKeys[0]].ingredients && step.products[step.productKeys[0]].ingredients.length > 0) {
              var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
              if(originalDishProducts) {
                var dishKey = DishInputService.getDishKey(step.stepType);
                var dish;
                if(originalDishProducts[dishKey]) {
                  dish = originalDishProducts[dishKey].dishes[0];
                } else {
                  if(originalDishProducts.dishes && originalDishProducts.dishes.length > 0) {
                    dish = originalDishProducts.dishes[0];
                  }
                }
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: []
                  };
                }
                step.products[step.productKeys[0]].dishes = [dish];
              } else {
                //error
                console.log("customStepService error: cannot trace dish input on custom step: ", step);
                ErrorService.logError({
                  message: "Custom Step Service ERROR: cannot trace dish input in function 'instantiateStep'",
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            }
          } else {
            //error
            console.log("customStepService error: no step found from input: ", dishInput);
            ErrorService.logError({
              message: "Custom Step Service ERROR: no step found from input in function 'instantiateStep'",
              dishInput: dishInput,
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        default:
          break;
      }
    }
    //check for isEmpty condition
    if(ingredientInputs && ingredientInputs.length > 0) {
      if((!step.products || !step.products[step.productKeys[0]]) || (!step.products[step.productKeys[0]].ingredients || step.products[step.productKeys[0]].ingredients.length === 0)) {
        step.isEmpty = true;
      } else {
        step.isEmpty = false;
      }
    }

    //assuming, for now, that there will be no ingredientTips that are
    //either general to all Steps or specific to the Custom type...
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, []);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var stepText = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "customStepText";
      }).val;
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //constructStep
    constructStepText(step);
  };

  return service;
}]);
