'use strict';
angular.module('main')
.directive('tipCollection', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {
      element.text('this is the tipCollection directive', attrs);
    }
  };
});
