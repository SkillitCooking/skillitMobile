'use strict';
angular.module('main')
.factory('RecipeService', function (Restangular) {
  var baseRecipes = Restangular.all('recipes');

  return {
    getRecipesWithIngredients: function(ingredientIds) {
      return baseRecipes.customPOST(ingredientIds, 'getRecipesWithIngredients');
    },
    getMoreRecipesForCategory: function(info) {
      return baseRecipes.customPOST(info, 'getMoreRecipesForCategory');
    },
    getRecipesWithIds: function(recipeIds) {
      return baseRecipes.customPOST(recipeIds, 'getRecipesWithIds');
    },
    getRecipesOfTheDay: function() {
      return baseRecipes.customPOST({}, 'getRecipesOfTheDay');
    },
    getRecipesForCollection: function(collectionId, pageNumber) {
      return baseRecipes.customPOST({collectionId: collectionId, pageNumber: pageNumber}, 'getRecipesForCollection');
    },
    getRecipesOfType: function(recipeType) {
      return baseRecipes.customPOST({recipeType: recipeType}, 'getRecipesOfType');
    }
  };

});