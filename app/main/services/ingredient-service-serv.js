'use strict';
angular.module('main')
.factory('IngredientService', function ($log, Restangular) {

  $log.log('Hello from your Service: IngredientService in module main');

  var baseIngredients = Restangular.all('ingredients');

  return {
    getIngredientsForSelection: function () {
      return baseIngredients.customGET('getIngredientsForSelection');
    }
  };

});
