'use strict';
angular.module('main')
.factory('seasonStepService', ['_', 'StepTipService', 'DishInputService', 'ErrorService', function (_, StepTipService, DishInputService, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var ingredientInput = step.stepInputs["ingredientInput"];
    var dishInput = step.stepInputs["dishInput"];
    step.ingredientsToSeason = [];
    //ingredient instantiation
    switch(ingredientInput.sourceType) {
      case "IngredientList":
        var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
          return type.typeName === ingredientInput.key;
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
            step.ingredientsToSeason = concatIngredients;
            if(!step.products){
              step.products = {};
              step.products[step.productKeys[0]] = {};
            }
            step.products[step.productKeys[0]].ingredients = step.ingredientsToSeason;
            step.isEmpty = false;
          } else {
            step.isEmpty = true;
          }
        } else {
          //error: no type found
          ErrorService.logError({
            message: "Season Step Service ERROR: no ingredientType found for input in function 'instantiateStep'",
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
        if(referencedStep){
          if(!referencedStep.isEmpty){
            if(referencedStep.products){
              step.ingredientsToSeason = referencedStep.products[ingredientInput.key].ingredients;
              if (!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {};
              }
              step.products[step.productKeys[0]].ingredients = step.ingredientsToSeason;
            } else {
              //error - no products for step
              ErrorService.logError({
                message: "Season Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } 
        } else {
          //error - can't find step from input
          console.log("seasonStepService error: can't find step from input: ", ingredientInput);
          ErrorService.logError({
            message: "Sautee Step Service ERROR: can't find step from input in function 'instantiateStep'",
            ingredientInput: ingredientInput,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("seasonStepService error: unexpected sourceType: ", ingredientInput);
        ErrorService.logError({
          message: "Season Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
          ingredientInput: ingredientInput,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //dish instantiation
    switch(dishInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishInput.key;
        });
        if(dish) {
          step.seasoningDish = dish;
          step.dishCameFromProduct = false;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {};
          }
          step.products[step.productKeys[0]].dishes = [step.seasoningDish];
        } else {
          //error
          ErrorService.logError({
            message: "Season Step Service ERROR: could not find dish from input in function 'instantiateStep'",
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
              step.seasoningDish = referencedStep.products[dishInput.key].dishes[0];
              step.dishCameFromProduct = true;
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {};
              }
              step.products[step.productKeys[0]].dishes = [step.seasoningDish];    
            } else {
              //error - no products for step
              ErrorService.logError({
                message: "Season Step Service ERROR: no products for referenced step in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } else if (step.ingredientsToSeason && step.ingredientsToSeason.length > 0) {
            var originalDishProducts = DishInputService.findDishProduct(referencedStep, recipe.stepList, recipe.ingredientList.equipmentNeeded);
            if(originalDishProducts) {
              var dishKey = DishInputService.getDishKey(step.stepType);
              if(originalDishProducts[dishKey]) {
                //then came from stepProduct
                step.seasoningDish = originalDishProducts[dishKey].dishes[0];
                step.dishCameFromProduct = true;
              } else {
                if(originalDishProducts.dishes && originalDishProducts.dishes.length > 0) {
                  //then came from EquipmentList
                  step.seasoningDish = originalDishProducts.dishes[0];
                  step.dishCameFromProduct = false;
                }
              }
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].dishes = [step.seasoningDish];
            } else {
              //error
              ErrorService.logError({
                message: "Season Step Service ERROR: cannot trace seasoningDish in function 'instantiateStep'",
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          }
        } else {
          //error - no find step from input
          ErrorService.logError({
            message: "Season Step Service ERROR: can't find step for input in function 'instantiateStep'",
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
          message: "Season Step Service ERROR: unexpected sourceType from input in function 'instantiateStep'",
          dishInput: dishInput,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //set isEmpty
    if(step.ingredientsToSeason.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set stepTips
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToSeason);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var isOil = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "isOil";
      }).val;
      var isSeason = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "isSeason";
      }).val;
      var stepText = "";
      if(isOil && isSeason){
        stepText += "Oil and season ";
      } else if (isOil) {
        stepText += "Oil ";
      } else if (isSeason) {
        stepText += "Season ";
      } else {
        //error need oil OR season
        ErrorService.logError({
          message: "Season Step Service ERROR: neither oil nor season in function 'constructStepText'",
          step: step
        });
        ErrorService.showErrorAlert();
      }
      switch(step.ingredientsToSeason.length) {
        case 0:
          //error
          ErrorService.logError({
            message: "Season Step Service ERROR: no ingredients to season in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToSeason[0].name[step.ingredientsToSeason[0].nameFormFlag].toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToSeason[0].name[step.ingredientsToSeason[0].nameFormFlag].toLowerCase() + " and " + step.ingredientsToSeason[1].name[step.ingredientsToSeason[1].nameFormFlag].toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToSeason.length - 1; i >= 0; i--) {
            if(i === 0){
              stepText += "and " + step.ingredientsToSeason[i].name[step.ingredientsToSeason[i].nameFormFlag].toLowerCase();
            } else {
              stepText += step.ingredientsToSeason[i].name[step.ingredientsToSeason[i].nameFormFlag].toLowerCase() + ", ";
            }
          }
          break;
      }
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //construct step
    constructStepText(step);
  };

  return service;
}]);
