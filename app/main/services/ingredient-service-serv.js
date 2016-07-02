'use strict';
angular.module('main')
.factory('IngredientService', function (Restangular) {

  var baseIngredients = Restangular.all('ingredients');

  return {
    getIngredientsForSelection: function () {
      return baseIngredients.customGET('getIngredientsForSelection');
    }
  };

});
