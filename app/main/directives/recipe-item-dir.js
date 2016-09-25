'use strict';
angular.module('main')
.directive('recipeItem', ['$filter', 'RECIPE_TYPES', 'RECIPE_DISCLAIMERS', function ($filter, RECIPE_TYPES, RECIPE_DISCLAIMERS) {
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
        var s = ""
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
