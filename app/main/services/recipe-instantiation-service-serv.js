'use strict';
angular.module('main')
.factory('RecipeInstantiationService', 
  ['_', 'bakeStepService', 'boilStepService', 'breakEggStepService', 'bringToBoilStepService', 
  'cookStepService', 'customStepService', 'cutStepService', 'dryStepService',
  'equipmentPrepStepService', 'heatStepService', 'moveStepService', 'placeStepService',
  'preheatOvenStepService', 'sauteeStepService', 'serveStepService', 'seasonStepService',
  'slowCookStepService', 'steamingStepService', 'stirStepService', 'ErrorService',
  function (_, bakeStepService, boilStepService, breakEggStepService, bringToBoilStepService, cookStepService,
    customStepService, cutStepService, dryStepService, equipmentPrepStepService,
    heatStepService, moveStepService, placeStepService, preheatOvenStepService, sauteeStepService,
    serveStepService, seasonStepService, slowCookStepService, steamingStepService, stirStepService, ErrorService) {
  var service = {};

  service.cullIngredients = function(recipes, ingredientNames, ingredientIds) {
    for (var i = recipes.length - 1; i >= 0; i--) {
      //don't process full because we want full recipes to appear without full
      //satisfaction, but we want them displayed as if they have full satisfaction
      //AlaCartes will have only one ingredient for now (and in the future, will
      //at least require full satisfaction of a small number of ingredients to appear)
      //And so will not need any of their ingredients culled if they were able to be
      //selected in the first place. Importantly, this allows for the simple removal
      //of ingredients from ingredientNames when adjusting the BYO
      if(/*recipes[i].recipeType !== "Full" && recipes[i].recipeType !== 'AlaCarte'*/true) {
        var ingredientTypes = recipes[i].ingredientList.ingredientTypes;
        for (var j = ingredientTypes.length - 1; j >= 0; j--) {
          var ingredients = ingredientTypes[j].ingredients;
          for(var k = ingredients.length - 1; k >= 0; k--) {
            if(!ingredientNames.includes(ingredients[k].name.standardForm)){
              if(recipes[i].recipeType !== 'AlaCarte') {
                if(recipes[i].recipeType === 'Full') {
                  //then mark recipe, ingredientType
                  recipes[i].notFullySatisfied = true;
                  ingredientTypes[j].notFullySatisfied = true;
                }
                ingredients[k].useInRecipe = false;
                //reset forms
                for (var l = ingredients[k].ingredientForms.length - 1; l >= 1; l--) {
                  ingredients[k].ingredientForms[l].useInRecipe = false;
                }
                ingredients[k].ingredientForms[0].useInRecipe = true;
              } 
            } else {
              ingredients[k].useInRecipe = true;
              //set forms to true/false
              var ingredId = _.find(ingredientIds, function(id) {
                return ingredients[k]._id === id._id;
              });
              for (var m = ingredients[k].ingredientForms.length - 1; m >= 0; m--) {
                if(ingredId.formIds.includes(ingredients[k].ingredientForms[m]._id)) {
                  ingredients[k].ingredientForms[m].useInRecipe = true;
                } else {
                  ingredients[k].ingredientForms[m].useInRecipe = false;
                }
              }
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

          case "BreakEgg":
            breakEggStepService.fillInStep(recipes[i], j);
            break;

          case "Cook":
            cookStepService.fillInStep(recipes[i], j);
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

          case "Move":
            moveStepService.fillInStep(recipes[i], j);
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

          case "Serve":
            serveStepService.fillInStep(recipes[i], j);
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
            ErrorService.logError({
              message: "RecipeInstantiation Service ERROR: unexpected stepType in function 'fillInSteps'",
              step: stepList[j]
            });
            ErrorService.showErrorAlert();
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

      case "BreakEgg":
        return true;

      case "Cook":
        return true;

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

      case "Move":
        return true;

      case "Place":
        return true;

      case "PreheatOven":
        return false;

      case "Sautee":
        return true;

      case "Season":
        return true;

      case "Serve":
        return true;

      case "SlowCook":
        return true;

      case "Steam":
        return true;

      case "Stir":
        return true;

      default:
        //error - unanticipated stepType
        ErrorService.logError({
          message: "RecipeInstantiation Service ERROR: unanticipated stepType in function 'hasIngredientInput'",
          step: step
        });
        ErrorService.showErrorAlert();
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

      case "BreakEgg":
        return step.stepInputs["dishInputs"];

      case "Cook":
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

      case "Move":
        return step.stepInputs["stepInput"];

      case "Place":
        return step.stepInputs["dishProductInput"];

      case "PreheatOven":
        return false;

      case "Sautee":
        return step.stepInputs["dishInput"];

      case "Season":
        return step.stepInputs["dishInput"];

      case "Serve":
        return step.stepInputs["dishInputs"];

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
        //error - expecting recipeCategorys
        ErrorService.logError({
          message: "RecipeInstantiation Service ERROR: unanticipated stepType in function 'getDishInput'",
          step: step
        });
        ErrorService.showErrorAlert();
    }
  }

  function setDishInputNotEmpty(dishInput, stepList) {
    if(dishInput.sourceType === "StepProduct") {
      var dishInputStep = _.find(stepList, function(step) {
        return step.stepId === dishInput.sourceId;
      });
      //here is where offending isEmpty is getting called
      if(!dishInputStep.isEmptyLink) {
        dishInputStep.isEmpty = false;
      }
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

  service.setTheRestIsEmpty = function(recipes) {
    for (var i = recipes.length - 1; i >= 0; i--) {
      var preheatIndex = -1;
      if(recipes[i].recipeType === "BYO") {
        var stepList = recipes[i].stepList;
        for (var j = stepList.length - 1; j >= 0; j--) {
          var step = stepList[j];
          if(!_.has(step, 'isEmpty')) {
            step.isEmpty = true;
          }
          //preheat check - assumes only one preheatOven per recipe
          if(step.stepType === 'PreheatOven') {
            preheatIndex = j;
          }
          if(step.stepType === 'Bake' && !step.isEmpty) {
            //then preheat needed, set index to -1
            preheatIndex = -1;
          }
        }
        if(preheatIndex !== -1) {
          //then set preheat to empty
          stepList[preheatIndex].isEmpty = true;
        }
      }
    }
  };

  return service;
}]);
