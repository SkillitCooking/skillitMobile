'use strict';
angular.module('main')
.directive('glossaryCollection', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {
      element.text('this is the glossaryCollection directive', attrs);
    }
  };
});
