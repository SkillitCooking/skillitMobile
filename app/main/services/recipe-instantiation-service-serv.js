'use strict';
angular.module('main')
.factory('RecipeInstantiationService', 
  ['bakeStepService', 'boilStepService', 'bringToBoilStepService',
  'customStepService',
  function (bakeStepService, boilStepService, bringToBoilStepService,
    customStepService) {
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
            //cutService
            break;

          case "Dry":
            //dryService
            break;

          case "Heat":
            //heatService
            break;

          case "Place":
            //placeService
            break;

          case "PreheatOven":
            //preheatoven Service
            break;

          case "Sautee":
            //SauteeService
            break;

          case "Season":
            //seasonService
            break;

          case "SlowCook":
            //slowCookService
            break;

          case "Steam":
            //steamService
            break;

          case "EquipmentPrep":
            //EquipmentPrepService
            break;

          case "Stir":
            //stirService
            break;

          default:
            //default error handling
            break;
        }
      }
    }
  };

  return service;
}]);
