'use strict';
angular.module('main')
.factory('RecipeInstantiationService', 
  ['bakeStepService', 'boilStepService', 'bringToBoilStepService',
  'customStepService', 'cutStepService', 'dryStepService',
  'equipmentPrepStepService', 'heatStepService', 'placeStepService',
  'preheatOvenStepService', 'sauteeStepService', 'seasonStepService',
  'slowCookStepService', 'steamingStepService', 'stirStepService',
  function (bakeStepService, boilStepService, bringToBoilStepService,
    customStepService, cutStepService, dryStepService, equipmentPrepStepService,
    heatStepService, placeStepService, preheatOvenStepService, sauteeStepService,
    seasonStepService, slowCookStepService, steamingStepService, stirStepService) {
  var service = {};

  service.cullIngredients = function(recipes, ingredientNames) {
    for (var i = recipes.length - 1; i >= 0; i--) {
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

  return service;
}]);
