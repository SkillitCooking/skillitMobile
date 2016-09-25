'use strict';
angular.module('main')
.factory('FavoriteRecipeService', function (Restangular) {
  var baseFavoriteRecipes = Restangular.all('favoriteRecipes');

  return {
    getFavoriteRecipesForUser: function(userInfo) {
      return baseFavoriteRecipes.customPOST(userInfo, 'getFavoriteRecipesForUser');
    },
    saveFavoriteRecipeForUser: function(info) {
      return baseFavoriteRecipes.customPOST(info, 'saveFavoriteRecipeForUser');
    },
    favoriteRecipeUsedForUser: function(info) {
      return baseFavoriteRecipes.customPOST(info, 'favoriteRecipeUsedForUser');
    }
  };
});
