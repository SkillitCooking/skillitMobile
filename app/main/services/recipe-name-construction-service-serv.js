'use strict';
angular.module('main')
.factory('RecipeNameConstructionService', function ($window, SeasoningProfileService, RecipeTitleAdjectiveService, HealthModifierService, LibraryFunctions, KEYS) {
  var service = {};

  var seasonings, modifiers, adjectives;

  service.loadPrefixes = function() {
    SeasoningProfileService.getSeasoningProfiles().then(function(res) {
      seasonings = res.data;
    });
    RecipeTitleAdjectiveService.getAllRecipeTitleAdjectives().then(function(res) {
      adjectives = res.data;
    });
    HealthModifierService.getAllHealthModifiers().then(function(res) {
      modifiers = res.data;
    });
  };

  service.getSeasonings = function() {
    if(seasonings) {
      return seasonings;
    } else {
      return false;
    }
  };

  service.getAdjectives = function() {
    if(adjectives) {
      return adjectives;
    } else {
      return false;
    }
  };

  service.getModifiers = function() {
    if(modifiers) {
      return modifiers;
    } else {
      return false;
    }
  };

  function makeDisplayName(prefix, nameBody) {
    return prefix + " " + nameBody;
  }

  service.switchNameForSeasoning = function(recipe, newSeasoning) {
    if(recipe.nameBodies) {
      var index;
      if(recipe.defaultSeasoningProfile.nameBodyIndex) {
        index = recipe.defaultSeasoningProfile.nameBodyIndex;
      } else {
        index = 0;
      }
      console.log('switch', recipe);
      console.log('seasonweit', newSeasoning);
      var suffix = recipe.nameBodies[newSeasoning._id];
      if(!suffix) {
        suffix = recipe.nameBodies[LibraryFunctions.getRandomObjectKey(recipe.nameBodies)].textArr[0];
      } else {
        suffix = recipe.nameBodies[newSeasoning._id].textArr[index];
      }
      var name = makeDisplayName(newSeasoning.recipeTitleAlias, suffix);
      if(recipe.mainName) {
        //how to also fucking track the textArr index used??
        recipe.mainName = name;
      } else {
        recipe.name = name;
      }
    }
  };

  service.setNewDefaultSeasoning = function(recipe, newSeasoning) {
    if(recipe.recipeType === 'Full') {
      recipe.defaultSeasoningProfile = newSeasoning;
    }
  };

  service.setPrefixedRecipeName = function(recipe) {
    if(!LibraryFunctions.isEmpty(recipe.nameBodies) && seasonings && modifiers && adjectives) {
      recipe.nameBodies[KEYS.BLANK] = KEYS.BLANK;
      //randomly choose prefix
      var randomKey = LibraryFunctions.getRandomObjectKey(recipe.nameBodies);
      var idMatch = function (element) {
        return randomKey === element._id;
      };
      var prefix;
      if(randomKey === KEYS.BLANK) {
        recipe.displayName = recipe.name;
        prefix = KEYS.BLANK;
      } else {
        var nameBodyType = recipe.nameBodies[randomKey].type;
        switch(nameBodyType) {
          case 'adjective':
            var adjective = adjectives.find(idMatch);
            if(adjective) {
              prefix = adjective.name;
              var randomNameBodyIndex = LibraryFunctions.getRandomIndex(recipe.nameBodies[randomKey].textArr.length);
              recipe.displayName = makeDisplayName(prefix, recipe.nameBodies[randomKey].textArr[randomNameBodyIndex]);
            } else {
              //look into actual cause for this safety case...
              prefix = KEYS.BLANK;
            }
            break;
          case 'modifier':
            var modifier = modifiers.find(idMatch);
            if(modifier) {
              prefix = modifier.name;
              var randomNameBodyIndex = LibraryFunctions.getRandomIndex(recipe.nameBodies[randomKey].textArr.length);
              recipe.displayName = makeDisplayName(prefix, recipe.nameBodies[randomKey].textArr[randomNameBodyIndex]);
            } else {
              //look into actual cause for this safety case...
              prefix = KEYS.BLANK;
            }
            break;
          case 'seasoning':
            var seasoning = seasonings.find(idMatch);
            if(seasoning) {
              prefix = seasoning.recipeTitleAlias;
            var randomNameBodyIndex = LibraryFunctions.getRandomIndex(recipe.nameBodies[randomKey].textArr.length);
              recipe.displayName = makeDisplayName(prefix, recipe.nameBodies[randomKey].textArr[randomNameBodyIndex]);
              recipe.newDefaultSeasoning = seasoning;
              recipe.newDefaultSeasoning.nameBodyIndex = randomNameBodyIndex;
            } else {
              //look into actual cause for this safety case...
              prefix = KEYS.BLANK;
            }
            break;
          default:
            break;
        }
        if(typeof $window.ga !== 'undefined') {
          $window.ga.trackEvent('NameConstruction', prefix, recipe.name);
        }
      }
      recipe.setPrefix = prefix;
    } else {
      recipe.displayName = recipe.name;
    }
  };

  return service;
});
