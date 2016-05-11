'use strict';
angular.module('main')
.factory('RecipeService', function ($log, Restangular) {

  $log.log('Hello from your Service: RecipeService in module main');
  var baseRecipes = Restangular.all('recipes');

  return {
    getRecipesWithIngredients: function(ingredientNames) {
      return baseRecipes.customPOST(ingredientNames, 'getRecipesWithIngredients');
    },
    getRecipesWithIds: function(recipeIds) {
      return baseRecipes.customPOST(recipeIds, 'getRecipesWithIds');
    }
  };

});
