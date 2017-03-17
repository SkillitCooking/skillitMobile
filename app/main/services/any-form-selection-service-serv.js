'use strict';
angular.module('main')
.factory('AnyFormSelectionService', function (_) {
  var service = {};

  service.selectForms = function(ingredientForms) {
    if(ingredientForms.length > 2) {
      var countToSelect = Math.ceil(ingredientForms.length / 2);
      var indicatorArr = new Array(ingredientForms.length);
      for (var i = indicatorArr.length - 1; i >= 0; i--) {
        if(countToSelect !== 0) {
          countToSelect--;
          indicatorArr[i] = true;
        } else {
          indicatorArr[i] = false;
        }
      }
      indicatorArr.sort(function() { return 0.5 - Math.random(); } );
      for (var i = ingredientForms.length - 1; i >= 0; i--) {
        if(indicatorArr[i]) {
          ingredientForms[i].isSelected = true;
        } else {
          ingredientForms[i].isSelected = false;
        }
      }
    } else {
      for (var i = ingredientForms.length - 1; i >= 0; i--) {
        ingredientForms[i].isSelected = true;
      }
    }
  };

  return service;
});
