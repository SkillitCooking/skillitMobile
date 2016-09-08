'use strict';
angular.module('main')
.factory('RecipeService', function (Restangular) {
  var baseRecipes = Restangular.all('recipes');

  return {
    getRecipesWithIngredients: function(ingredientIds) {
      return baseRecipes.customPOST(ingredientIds, 'getRecipesWithIngredients');
    },
    getRecipesWithIds: function(recipeIds) {
      return baseRecipes.customPOST(recipeIds, 'getRecipesWithIds');
    },
    getRecipesOfTheDay: function() {
      return baseRecipes.customPOST({}, 'getRecipesOfTheDay');
    },
    getRecipesForCollection: function(collectionId) {
      return baseRecipes.customPOST({collectionId: collectionId}, 'getRecipesForCollection');
    },
    getRecipesOfType: function(recipeType) {
      return baseRecipes.customPOST({recipeType: recipeType}, 'getRecipesOfType');
    }
  };

});