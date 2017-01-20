'use strict';
angular.module('main')
.directive('recipeItem', ['$filter', 'RECIPE_TYPES', 'RECIPE_DISCLAIMERS', 'RECIPE_BADGES', function ($filter, RECIPE_TYPES, RECIPE_DISCLAIMERS, RECIPE_BADGES) {
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
      scope.getBadgeIcon = function(badge) {
        switch(badge) {
          case 'easy_cleanup':
            return RECIPE_BADGES.EASY_CLEANUP;
          case 'lean_protein':
            return RECIPE_BADGES.LEAN_PROTEIN;
          case 'minimal_prep':
            return RECIPE_BADGES.MINIMAL_PREP;
          case 'paleo':
            return RECIPE_BADGES.PALEO;
          case 'pescatarian':
            return RECIPE_BADGES.PESCATARIAN;
          case 'quick_eats':
            return RECIPE_BADGES.QUICK_EATS;
          case 'reducetarian':
            return RECIPE_BADGES.REDUCETARIAN;
          case 'vegan':
            return RECIPE_BADGES.VEGAN;
          case 'vegetarian':
            return RECIPE_BADGES.VEGETARIAN;
          case 'well_rounded':
            return RECIPE_BADGES.WELL_ROUNDED;
          default:
            break;
        }
      };

      scope.getBadgeIcon = function(badge) {
        switch(badge) {
          case 'easy_cleanup':
            return RECIPE_BADGES.EASY_CLEANUP;
          case 'lean_protein':
            return RECIPE_BADGES.LEAN_PROTEIN;
          case 'minimal_prep':
            return RECIPE_BADGES.MINIMAL_PREP;
          case 'paleo':
            return RECIPE_BADGES.PALEO;
          case 'pescatarian':
            return RECIPE_BADGES.PESCATARIAN;
          case 'quick_eats':
            return RECIPE_BADGES.QUICK_EATS;
          case 'reducetarian':
            return RECIPE_BADGES.REDUCETARIAN;
          case 'vegan':
            return RECIPE_BADGES.VEGAN;
          case 'vegetarian':
            return RECIPE_BADGES.VEGETARIAN;
          case 'well_rounded':
            return RECIPE_BADGES.WELL_ROUNDED;
          default:
            break;
        }
      };

      scope.getBadgeName = function(badge) {
        switch(badge) {
          case 'easy_cleanup':
            return RECIPE_BADGES.EASY_CLEANUP_NAME;
          case 'lean_protein':
            return RECIPE_BADGES.LEAN_PROTEIN_NAME;
          case 'minimal_prep':
            return RECIPE_BADGES.MINIMAL_PREP_NAME;
          case 'paleo':
            return RECIPE_BADGES.PALEO_NAME;
          case 'pescatarian':
            return RECIPE_BADGES.PESCATARIAN_NAME;
          case 'quick_eats':
            return RECIPE_BADGES.QUICK_EATS_NAME;
          case 'reducetarian':
            return RECIPE_BADGES.REDUCETARIAN_NAME;
          case 'vegan':
            return RECIPE_BADGES.VEGAN_NAME;
          case 'vegetarian':
            return RECIPE_BADGES.VEGETARIAN_NAME;
          case 'well_rounded':
            return RECIPE_BADGES.WELL_ROUNDED_NAME;
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
