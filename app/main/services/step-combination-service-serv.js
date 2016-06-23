'use strict';
angular.module('main')
.factory('StepCombinationService', ['_', 'RecipeOrderingService', 'SeasoningProfileTextService', function (_, RecipeOrderingService, SeasoningProfileTextService) {
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
      case 'Cook':
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

  function getAlaCarteNames(recipeNames) {
    switch(recipeNames.length) {
      case 0:
        //error case - expect at least one recipe name - otherwise, would have skipped this case
        console.log("StepCombinationService error: expecting a recipe name, didn't get any");
          break;
      case 1:
        return recipeNames[0];
      case 2:
        return recipeNames[0] + " and " + recipeNames[1];
      default:
        var retVal = "";
        for (var i = recipeNames.length - 1; i >= 0; i--) {
          if(i === 0) {
            retVal += "and " + recipeNames[i];
          } else {
            retVal += recipeNames[i] + ", ";
          }
        }
        return retVal;
    }
  }

  function combineRecipes(recipes, currentSeasoningProfile) {
    //order with respect to time remaining for recipe
    if(recipes.length > 1) {
      var combinedRecipe = {};
      combinedRecipe.stepList = [];
      var alaCarteRecipeNames = [];
      for (var i = recipes.length - 1; i >= 0; i--) {
        if(recipes[i].recipeType === 'Full' || recipes[i].recipeType === 'BYO') {
          combinedRecipe.mainName = recipes[i].name;
        } else if(recipes[i].recipeType === 'AlaCarte') {
          alaCarteRecipeNames.push(recipes[i].name);
        }
      }
      combinedRecipe.alaCarteNames = getAlaCarteNames(alaCarteRecipeNames);
      //if no mainName set, then make combination of AlaCarte recipes mainName
      if(!combinedRecipe.mainName) {
        combinedRecipe.mainName = combinedRecipe.alaCarteNames;
      }
      combinedRecipe.prepTime = _.reduce(recipes, function(prepTime, recipe) {
        return prepTime + recipe.prepTime;
      }, 0);
      //round prepTime to nearest 5 minutes
      combinedRecipe.prepTime = 5 * Math.round(combinedRecipe.prepTime/5);
      combinedRecipe.totalTime = _.reduce(recipes, function(totalTime, recipe) {
        return totalTime + recipe.totalTime;
      }, 0);
      //round totalTime to nearest 5 minutes
      combinedRecipe.totalTime = 5 * Math.round(combinedRecipe.totalTime/5);
      combinedRecipe.mainVideoURLs = _.map(recipes, function(recipe) {
        return recipe.mainVideoURL + '&rel=0';
      });
      //_.reverse(combinedRecipe.mainVideoURLs);
      //set combinedRecipe recipeCategories
      combinedRecipe.recipeCategorys = [];
      for (var i = recipes.length - 1; i >= 0; i--) {
        combinedRecipe.recipeCategorys.push(recipes[i].recipeCategory);
      }
      //reverse recipe steps for popping
      for (var i = recipes.length - 1; i >= 0; i--) {
        _.reverse(recipes[i].stepList);
      }
      
      //sort recipes
      recipes.sort(RecipeOrderingService.fullRecipeCmp);
      //assign canAddSeasoningProfile if any of the recipes can
      for (var i = recipes.length - 1; i >= 0; i--) {
        if(recipes[i].canAddSeasoningProfile) {
          combinedRecipe.canAddSeasoningProfile = true;
          if(currentSeasoningProfile) {
            combinedRecipe.defaultSeasoningProfile = currentSeasoningProfile;
          } else {
            combinedRecipe.defaultSeasoningProfile = recipes[i].defaultSeasoningProfile;
          }
          break;
        }
      }
      var recipe = recipes.pop();
      while(hasSteps(recipe)) {
        var step = recipe.stepList.pop();
        recipe.totalTime -= step.stepDuration;
        if(isPrepStep(step)) {
          recipe.prepTime -= step.stepDuration;
        }
        RecipeOrderingService.addToStepList(combinedRecipe.stepList, step, combinedRecipe.defaultSeasoningProfile);
        //how to use comparison function for sortingIndex?
        recipes.binaryInsert(recipe, false, RecipeOrderingService.fullRecipeCmp);
        recipe = recipes.pop();
      }
      //expect combinedRecipe to order on basis of timeLeft
      return combinedRecipe;
    } else {
      //set initial seasoning
      if(recipes[0] && recipes[0].canAddSeasoningProfile){
        for (var i = recipes[0].stepList.length - 1; i >= 0; i--) {
          if(recipes[0].stepList[i].stepType === 'Season') {
            //then add defaultSeasoningText
            SeasoningProfileTextService.addSeasoning(recipes[0].stepList[i], recipes[0].defaultSeasoningProfile);
          }
        }
      }
      //adjust mainVideoUrl
      //round cookTimes
      if(recipes[0]) {
        recipes[0].mainVideoUrl += '&rel=0';
        recipes[0].prepTime = 5 * Math.round(recipes[0].prepTime/5);
        recipes[0].totalTime = 5 * Math.round(recipes[0].totalTime/5);
      }
      return recipes[0];
    }
  }

  service.getCombinedRecipe = function(recipes, currentSeasoningProfile) {
    var combinedRecipe = combineRecipes(recipes, currentSeasoningProfile);
    assignStepNumbers(combinedRecipe);
    return combinedRecipe;
  };

  return service;
}]);
