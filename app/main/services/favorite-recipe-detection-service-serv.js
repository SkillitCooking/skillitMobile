'use strict';
angular.module('main')
.factory('FavoriteRecipeDetectionService', ['_', '$ionicUser', function (_, $ionicUser) {
  var service = {};

  service.getFavoriteId = function(recipeIds) {
    var favoriteRecipeIds = $ionicUser.get('favoriteRecipeIds');
    //sorting is for making set-like equality comparisons
    if(recipeIds && favoriteRecipeIds) {
      recipeIds.sort();
      for (var i = favoriteRecipeIds.length - 1; i >= 0; i--) {
        favoriteRecipeIds[i].recipeIds.sort();
        if(_.isEqual(favoriteRecipeIds[i].recipeIds, recipeIds)) {
          return favoriteRecipeIds[i]._id;
        }
      }
    }
    //if no equality found in any of the favoriteRecipes
    return false;
  };

  return service;
}]);
