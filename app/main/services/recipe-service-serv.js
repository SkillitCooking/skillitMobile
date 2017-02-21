'use strict';
angular.module('main')
.factory('RecipeService', function (Restangular, COMPATIBILITY) {
  var baseRecipes = Restangular.all('recipes');

  return {
    getRecipesWithIngredients: function(ingredientIds, userId, userToken) {
      return baseRecipes.customPOST({ingredientIds: ingredientIds, userId: userId, userToken: userToken, compatibilityVersion: COMPATIBILITY.VERSION}, 'getRecipesWithIngredients');
    },
    getRecipesWithIngredientsNew: function(ingredientIds, userId, userToken) {
      return baseRecipes.customPOST({
        ingredientIds: ingredientIds,
        userId: userId,
        userToken: userToken,
        compatibilityVersion: COMPATIBILITY.VERSION
      }, 'getRecipesWithIngredientsNew');
    },
    getMoreRecipesForSelection: function(idsToFetch) {
      return baseRecipes.customPOST({ingredientIds: idsToFetch, compatibilityVersion: COMPATIBILITY.VERSION}, 'getMoreRecipesForSelection');
    },
    getMoreRecipesForCategory: function(info) {
      info.compatibilityVersion = COMPATIBILITY.VERSION;
      return baseRecipes.customPOST(info, 'getMoreRecipesForCategory');
    },
    getRecipesWithIds: function(recipeIds) {
      recipeIds.compatibilityVersion = COMPATIBILITY.VERSION;
      return baseRecipes.customPOST(recipeIds, 'getRecipesWithIds');
    },
    getRecipesOfTheDay: function() {
      return baseRecipes.customPOST({compatibilityVersion: COMPATIBILITY.VERSION}, 'getRecipesOfTheDay');
    },
    getRecipesForCollection: function(collectionId, pageNumber, userId, userToken) {
      return baseRecipes.customPOST({collectionId: collectionId, pageNumber: pageNumber, userId: userId, userToken: userToken, compatibilityVersion: COMPATIBILITY.VERSION}, 'getRecipesForCollection');
    },
    getRecipesOfType: function(recipeType, userId, userToken) {
      return baseRecipes.customPOST({recipeType: recipeType, userId: userId, userToken: userToken, compatibilityVersion: COMPATIBILITY.VERSION}, 'getRecipesOfType');
    }
  };

});