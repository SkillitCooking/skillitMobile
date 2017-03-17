'use strict';
angular.module('main')
.factory('MealsCookedService', function (Restangular) {
  var baseMealsCooked = Restangular.all('mealsCooked');

  return {
    postCookedMeal: function(info) {
      return baseMealsCooked.customPOST(info, '/');
    }
  };
});
