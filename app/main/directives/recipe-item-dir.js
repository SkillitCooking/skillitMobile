'use strict';
angular.module('main')
.directive('recipeItem', function () {
  return {
    templateUrl: 'main/templates/recipe-item.html',
    restrict: 'E',
    scope: {
      recipe: '=',
      iconclass: '=',
      showdatefeatured: '='
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
    }
  };
});
