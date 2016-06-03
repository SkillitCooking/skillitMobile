'use strict';
angular.module('main')
.factory('StepCombinationService', ['_', 'RecipeOrderingService', function (_, RecipeOrderingService) {
  var service = {};

  /* 
    target: the object to search for in the array
    comparator: (optional) a method for comparing the target object type
    return value: index of a matching item in the array if one exists, otherwise the bitwise complement of the index where the item belongs
  */
  Array.prototype.binarySearch = function(target, comparator) {
    var l = 0,
        h = this.length - 1,
        m, comparison;
    //use default comparator if none provided
    comparator = comparator || RecipeOrderingService.genericCmp;
    while(l <= h) {
      //faster than Math.floor((l+h) / 2)
      m = (l + h) >>> 1;
      comparison = comparator(this[m], target);
      if(comparison < 0) {
        l = m + 1;
      } else if (comparison > 0) {
        h = m - 1;
      } else {
        return m;
      }
    }
    return ~l;
  };

  /*
    target: the object to insert into the array
    duplicate: (optional) whether to insert the object into the array even if a matching object already exists in the array (false by default)
    comparator: (optional) a method for comparing the target object type
    return value: the index where the object was inserted into the array, or the index of a matching object in the array if a match was found and the duplicate parameter was false 
  */
  Array.prototype.binaryInsert = function(target, duplicate, comparator) {
    var i = this.binarySearch(target, comparator);
    if(i >= 0) {
      //if binarySearch return value is 0 or positive, then a matching value was found
      if(!duplicate) {
        return i;
      }
    } else {
      //if return value is negative, then bitwise complement of binarySearch is the correct insertion index
      i = ~i;
    }
    this.splice(i, 0, target);
    return i;
  };

  function assignStepNumbers(combinedRecipe) {
    var stepNumber = 1;
    if(combinedRecipe) {
      for (var i = 0; i < combinedRecipe.stepList.length; i++) {
        if(!combinedRecipe.stepList[i].isEmpty){
          if(combinedRecipe.stepList[i].textArr) {
            for (var j = 0; j < combinedRecipe.stepList[i].textArr.length; j++) {
              combinedRecipe.stepList[i].textArr[j].stepNumber = stepNumber;
              stepNumber += 1;
            }
          } else {
            combinedRecipe.stepList[i].stepNumber = stepNumber;
            stepNumber += 1;
          }
        }
      }
    }
  }

  function hasSteps(recipe) {
    return recipe.stepList.length > 0;
  }

  function isPrepStep(step) {
    switch(step.stepType) {
      case 'Bake':
      case 'Boil':
      //below case may end up getting special handling
      case 'Custom':
      case 'Sautee':
      case 'SlowCook':
      case 'Steam':
        return false;

      case 'BringToBoil':
      case 'Cut':
      case 'Dry':
      case 'EquipmentPrep':
      case 'Heat':
      case 'Place':
      case 'PreheatOven':
      case 'Season':
      case 'Stir':
        return true;

      default:
        //error - unexpected step.stepType
        console.log("StepCombinationService error: unrecognized stepType: ", step);
        break;
    }
  }

  function combineRecipes(recipes) {
    //order with respect to time remaining for recipe
    if(recipes.length > 1) {
      var combinedRecipe = {};
      combinedRecipe.stepList = [];
      combinedRecipe.name = _.join(_.map(recipes, function(recipe) {
        return recipe.name;
      }), ' + ');
      combinedRecipe.prepTime = _.reduce(recipes, function(prepTime, recipe) {
        return prepTime + recipe.prepTime;
      }, 0);
      combinedRecipe.totalTime = _.reduce(recipes, function(totalTime, recipe) {
        return totalTime + recipe.totalTime;
      }, 0);
      combinedRecipe.mainVideoURLs = _.map(recipes, function(recipe) {
        return recipe.mainVideoURL;
      });
      //reverse recipe steps for popping
      for (var i = recipes.length - 1; i >= 0; i--) {
        _.reverse(recipes[i].stepList);
      }
      
      //sort recipes
      recipes.sort(RecipeOrderingService.fullRecipeCmp);
      var recipe = recipes.pop();
      while(hasSteps(recipe)) {
        var step = recipe.stepList.pop();
        recipe.totalTime -= step.stepDuration;
        if(isPrepStep(step)) {
          recipe.prepTime -= step.stepDuration;
        }
        RecipeOrderingService.addToStepList(combinedRecipe.stepList, step);
        //how to use comparison function for sortingIndex?
        recipes.binaryInsert(recipe, false, RecipeOrderingService.fullRecipeCmp);
        recipe = recipes.pop();
      }
      //expect combinedRecipe to order on basis of timeLeft
      return combinedRecipe;
    } else {
      return recipes[0];
    }
  }

  service.getCombinedRecipe = function(recipes) {
    var combinedRecipe = combineRecipes(recipes);
    assignStepNumbers(combinedRecipe);
    return combinedRecipe;
  };

  return service;
}]);
