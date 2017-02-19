'use strict';
angular.module('main')
.directive('recipeItem', ['LibraryFunctions', '$filter', 'RECIPE_TYPES', 'RECIPE_DISCLAIMERS', 'RECIPE_BADGES', function (LibraryFunctions, $filter, RECIPE_TYPES, RECIPE_DISCLAIMERS, RECIPE_BADGES) {
  return {
    templateUrl: 'main/templates/recipe-item.html',
    restrict: 'E',
    scope: {
      recipe: '=',
      iconclass: '=',
      showdatefeatured: '=',
      isfavorite: '='
    },
    link: function (scope, element, attrs) {
      function recipeBadgeSort(a, b) {
        if(a === 'gluten_free') {
          return 1;
        }
        if(b === 'gluten_free') {
          return -1;
        }
        return 0;
      }

      scope.getPictureURL = function() {
        if(!scope.chosenPictureURL) {
          if(scope.recipe.mainPictureURLs) {
            var index = LibraryFunctions.getRandomIndex(scope.recipe.mainPictureURLs.length);
            scope.chosenPictureURL = scope.recipe.mainPictureURLs[index];
          } else {
            scope.chosenPictureURL = scope.recipe.mainPictureURL;
          }
        }
        return scope.chosenPictureURL;
      };

      console.log('scope.recipe', scope.recipe);

      if(scope.recipe.badges) {
        scope.recipe.badges.sort(recipeBadgeSort);
        scope.shortRecipeBadges = scope.recipe.badges.slice(0, 3);
      }
      
      scope.getBadgeIcon = function(badge) {
        switch(badge) {
          case 'gluten_free':
            return RECIPE_BADGES.GLUTEN_FREE;
          case 'lean_protein':
            return RECIPE_BADGES.LEAN_PROTEIN;
          case 'paleo':
            return RECIPE_BADGES.PALEO;
          case 'pescatarian':
            return RECIPE_BADGES.PESCATARIAN;
          case 'quick_eats':
            return RECIPE_BADGES.QUICK_EATS;
          case 'vegan':
            return RECIPE_BADGES.VEGAN;
          case 'vegetarian':
            return RECIPE_BADGES.VEGETARIAN;
          default:
            break;
        }
      };

      scope.getBadgeName = function(badge) {
        switch(badge) {
          case 'gluten_free':
            return RECIPE_BADGES.GLUTEN_FREE_NAME;
          case 'lean_protein':
            return RECIPE_BADGES.LEAN_PROTEIN_NAME;
          case 'paleo':
            return RECIPE_BADGES.PALEO_NAME;
          case 'pescatarian':
            return RECIPE_BADGES.PESCATARIAN_NAME;
          case 'quick_eats':
            return RECIPE_BADGES.QUICK_EATS_NAME;
          case 'vegan':
            return RECIPE_BADGES.VEGAN_NAME;
          case 'vegetarian':
            return RECIPE_BADGES.VEGETARIAN_NAME;
          default:
            break;
        }
      };

      scope.getRecipeActiveTime = function() {
        if(scope.recipe.manActiveTime && scope.recipe.manActiveTime !== "") {
          return scope.recipe.manActiveTime;
        } else {
          return scope.recipe.prepTime;
        }
      };

      scope.getRecipeTotalTime = function() {
        scope.getRecipeTotalTime = function() {
          if(scope.recipe.manTotalTime && scope.recipe.manTotalTime !== "") {
            return scope.recipe.manTotalTime;
          } else {
            return scope.recipe.totalTime;
          }
        };
      };

      scope.getFavoriteRecipeDescription = function() {
        var s = "";
        if(scope.recipe.timesUsed > 1) {
          s = "s";
        }
        return 'You favorited this recipe on ' + $filter('date')(scope.recipe.dateCreated, 'shortDate');
      };

      scope.showRecipeDisclaimer = function() {
        if(scope.recipe.recipeType === RECIPE_TYPES.FULL) {
          if(scope.recipe.setModifiedDisclaimer) {
            return true;
          }
        }
        return false;
      };

      scope.getRecipeDisclaimer = function() {
        if(scope.recipe.setModifiedDisclaimer) {
          return RECIPE_DISCLAIMERS.MODIFIED;
        }
      };
    }
  };
}]);
