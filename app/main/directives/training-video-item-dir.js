'use strict';
angular.module('main')
.directive('trainingVideoItem', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {
      element.text('this is the trainingVideoItem directive', attrs);
    }
  };
});
