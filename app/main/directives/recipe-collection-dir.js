'use strict';
angular.module('main')
.directive('recipeCollection', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {
      element.text('this is the recipeCollection directive', attrs);
    }
  };
});
