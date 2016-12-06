'use strict';
angular.module('main')
.factory('RecipeService', function (Restangular) {
  var baseRecipes = Restangular.all('recipes');

  return {
    getRecipesWithIngredients: function(ingredientIds, userId, userToken) {
      return baseRecipes.customPOST({ingredientIds: ingredientIds, userId: userId, userToken: userToken}, 'getRecipesWithIngredients');
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
    getRecipesForCollection: function(collectionId, pageNumber, userId, userToken) {
      return baseRecipes.customPOST({collectionId: collectionId, pageNumber: pageNumber, userId: userId, userToken: userToken}, 'getRecipesForCollection');
    },
    getRecipesOfType: function(recipeType, userId, userToken) {
      return baseRecipes.customPOST({recipeType: recipeType, userId: userId, userToken: userToken}, 'getRecipesOfType');
    }
  };

});