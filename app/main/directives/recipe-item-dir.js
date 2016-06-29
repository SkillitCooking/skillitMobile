'use strict';
angular.module('main')
.directive('recipeItem', function () {
  return {
    templateUrl: 'main/templates/recipe-item.html',
    restrict: 'E',
    scope: {
      recipe: '=',
      iconclass: '=',
      showdatefeatured: '='
    },
    link: function (scope, element, attrs) {
      
    }
  };
});
