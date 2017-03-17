'use strict';
angular.module('main')
.factory('IngredientsUsedService', function (Restangular) {
  var baseIngredientsUsed = Restangular.all('ingredientsUsed');

  return {
    postUsedIngredients: function(info) {
      return baseIngredientsUsed.customPOST(info, '/');
    }
  };
});
