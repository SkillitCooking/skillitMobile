'use strict';
angular.module('main')
.factory('GeneralTextService', function () {
  var service = {};

  service.assignIngredientDisplayNames = function(ingredients) {
    for (var i = ingredients.length - 1; i >= 0; i--) {
      if(!ingredients[i].nameFormFlag) {
        ingredients[i].nameFormFlag = "standardForm";
      }
      if(ingredients[i].useFormNameForDisplay) {
        //need count of "useInRecipe" Forms
        var formCount = 0;
        var formIndex = -1;
        for (var j = ingredients[i].ingredientForms.length - 1; j >= 0; j--) {
          if(ingredients[i].ingredientForms[j].useInRecipe) {
            formCount++;
            formIndex = j;
          }
        }
        if(formCount > 1) {
          ingredients[i].displayName = ingredients[i].name[ingredients[i].nameFormFlag];
        } else {
          if(formIndex > -1) {
            ingredients[i].displayName = ingredients[i].ingredientForms[formIndex].name;
          }
        }
      } else {
        ingredients[i].displayName = ingredients[i].name[ingredients[i].nameFormFlag];
      }
    }
  };

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
