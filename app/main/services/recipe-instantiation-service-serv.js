'use strict';
angular.module('main')
.factory('RecipeInstantiationService', 
  ['_', 'bakeStepService', 'boilStepService', 'bringToBoilStepService',
  'customStepService', 'cutStepService', 'dryStepService',
  'equipmentPrepStepService', 'heatStepService', 'placeStepService',
  'preheatOvenStepService', 'sauteeStepService', 'seasonStepService',
  'slowCookStepService', 'steamingStepService', 'stirStepService',
  function (_, bakeStepService, boilStepService, bringToBoilStepService,
    customStepService, cutStepService, dryStepService, equipmentPrepStepService,
    heatStepService, placeStepService, preheatOvenStepService, sauteeStepService,
    seasonStepService, slowCookStepService, steamingStepService, stirStepService) {
  var service = {};

  service.cullIngredients = function(recipes, ingredientNames) {
    for (var i = recipes.length - 1; i >= 0; i--) {
      if(recipes[i].recipeType !== "Full") {
        var ingredientTypes = recipes[i].ingredientList.ingredientTypes;
        for (var j = ingredientTypes.length - 1; j >= 0; j--) {
          var ingredients = ingredientTypes[j].ingredients;
          for(var k = ingredients.length - 1; k >= 0; k--) {
            if(!ingredientNames.includes(ingredients[k].name)){
              ingredients.splice(k, 1);
            }
          }
        }
      }
    }
  };

  service.fillInSteps = function(recipes) {
    for (var i = recipes.length - 1; i >= 0; i--) {
      var stepList = recipes[i].stepList;
      for (var j = 0; j < stepList.length; j++) {
        switch(stepList[j].stepType) {
          case "Bake":
            bakeStepService.fillInStep(recipes[i], j);
            break;

          case "Boil":
            boilStepService.fillInStep(recipes[i], j);
            break;

          case "BringToBoil":
            bringToBoilStepService.fillInStep(recipes[i], j);
            break;

          case "Custom":
            customStepService.fillInStep(recipes[i], j);
            break;

          case "Cut":
            cutStepService.fillInStep(recipes[i], j);
            break;

          case "Dry":
            dryStepService.fillInStep(recipes[i], j);
            break;

          case "Heat":
            heatStepService.fillInStep(recipes[i], j);
            break;

          case "Place":
            placeStepService.fillInStep(recipes[i], j);
            break;

          case "PreheatOven":
            preheatOvenStepService.fillInStep(recipes[i], j);
            break;

          case "Sautee":
            sauteeStepService.fillInStep(recipes[i], j);
            break;

          case "Season":
            seasonStepService.fillInStep(recipes[i], j);
            break;

          case "SlowCook":
            slowCookStepService.fillInStep(recipes[i], j);
            break;

          case "Steam":
            steamingStepService.fillInStep(recipes[i], j);
            break;

          case "EquipmentPrep":
            equipmentPrepStepService.fillInStep(recipes[i], j);
            break;

          case "Stir":
            stirStepService.fillInStep(recipes[i], j);
            break;

          default:
            //default error handling
            console.log("RecipeInstantiationService error: unexpected stepType: ", stepList[j]);
            break;
        }
      }
    }
  };

  function hasIngredientInput(step) {
    switch(step.stepType) {
      case "Bake":
        return true;

      case "Boil":
        return true;

      case "BringToBoil":
        return false;

      case "Custom":
        return true;

      case "Cut":
        return true;

      case "Dry":
        return true;

      case "EquipmentPrep":
        return false;

      case "Heat":
        return false;

      case "Place":
        return true;

      case "PreheatOven":
        return false;

      case "Sautee":
        return true;

      case "SlowCook":
        return true;

      case "Steam":
        return true;

      case "Stir":
        return true;

      default:
        //error - unanticipated stepType
        console.log("RecipeInstantiationService error: unanticipated stepType: ", step);
    }
  }

  function getDishInput(step) {
    switch(step.stepType) {
      case "Bake":
        //though Bake has a dish used, the Dish will come from
        //the same step as ingredients, so return false here
        return false;

      case "Boil":
        return step.stepInputs["dishInput"];

      case "BringToBoil":
        return step.stepInputs["dishInput"];

      case "Custom":
        return step.stepInputs["dishInputs"];

      case "Cut":
        return false;

      case "Dry":
        return false;

      case "EquipmentPrep":
        return step.stepInputs["dishInputs"];

      case "Heat":
        return step.stepInputs["dishInput"];

      case "Place":
        return step.stepInputs["dishProductInput"];

      case "PreheatOven":
        return false;

      case "Sautee":
        return step.stepInputs["dishInput"];

      case "Season":
        return step.stepInputs["dishInput"];

      case "SlowCook":
        return false;

      case "Steam":
        return step.stepInputs["dishInput"];

      case "Stir":
        //though has "StirObjectInput", is always tied to some ingredients
        return false;

      default: 
        //error - unanticipated stepType
        console.log("RecipeInstantiationService error: unanticipated stepType: ", step); 
    }
  }

  function setDishInputNotEmpty(dishInput, stepList) {
    if(dishInput.sourceType === "StepProduct") {
      var dishInputStep = _.find(stepList, function(step) {
        return step.stepId === dishInput.sourceId;
      });
      step.isEmpty = false;
      var newDishInput = getDishInput(dishInputStep);
      if(newDishInput) {
        if(Array.isArray(newDishInput)) {
          for (var i = newDishInput.length - 1; i >= 0; i--) {
            setDishInputNotEmpty(newDishInput[i], stepList);
          }
        } else {
          setDishInputNotEmpty(newDishInput, stepList);
        }
      }
    }
  }

  service.setBackwardsIsEmptySteps = function(recipes) {
    for (var i = recipes.length - 1; i >= 0; i--) {
      if(recipes[i].recipeType === "BYO") {
        for (var j = recipes[i].stepList.length - 1; j >= 0; j--) {
          var step = recipes[i].stepList[j];
          if(!step.isEmpty && hasIngredientInput(step)) {
            var dishInput = getDishInput(step);
            if(dishInput) {
              //check if dishInput is array, then handle accordingly
              if(Array.isArray(dishInput)) {
                for (var k = dishInput.length - 1; k >= 0; k--) {
                  setDishInputNotEmpty(dishInput[k], recipes[i].stepList);
                }
              } else {
                setDishInputNotEmpty(dishInput, recipes[i].stepList);
              }
            }
          }
        }
      }
    }
  };

  return service;
}]);
