'use strict';
angular.module('main')
.directive('howToShopCollection', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {
      element.text('this is the howToShopCollection directive', attrs);
    }
  };
});
