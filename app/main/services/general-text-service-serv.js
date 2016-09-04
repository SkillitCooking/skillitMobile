'use strict';
angular.module('main')
.factory('GeneralTextService', function () {
  var service = {};

  service.assignIngredientPrefixes = function(ingredients) {
    //add appropriate prefixes to ingredients
    for (var i = ingredients.length - 1; i >= 0; i--) {
      if(ingredients[i].isMultiple) {
        if(ingredients[i].hasBeenUsed) {
          ingredients[i].prefix = "the";
          if(ingredients[i].transformationPrefix && ingredients[i].transformationPrefix !== "") {
            ingredients[i].prefix += " " + ingredients[i].transformationPrefix.toLowerCase();
          }
        } else {
          ingredients[i].prefix = "some of the";
        }
      } else {
        ingredients[i].prefix = "";
      }
    }
  };

  return service;
});
