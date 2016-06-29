'use strict';
angular.module('main')
.factory('RecipeService', function (Restangular) {
  var baseRecipes = Restangular.all('recipes');

  return {
    getRecipesWithIngredients: function(ingredientNames) {
      return baseRecipes.customPOST(ingredientNames, 'getRecipesWithIngredients');
    },
    getRecipesWithIds: function(recipeIds) {
      return baseRecipes.customPOST(recipeIds, 'getRecipesWithIds');
    },
    getRecipesOfTheDay: function() {
      return baseRecipes.customPOST({}, 'getRecipesOfTheDay');
    }
  };

});