'use strict';
angular.module('main')
.factory('IngredientService', function (Restangular) {

  var baseIngredients = Restangular.all('ingredients');

  return {
    getIngredientsForSelection: function (userId, userToken) {
      return baseIngredients.customPOST({userId: userId, userToken: userToken}, 'getIngredientsForSelection');
    }
  };

});
