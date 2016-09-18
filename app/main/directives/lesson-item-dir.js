'use strict';
angular.module('main')
.directive('lessonItem', function () {
  return {
    templateUrl: 'main/templates/lesson-item.html',
    restrict: 'E',
    scope: {
      lesson: '='
    },
    link: function (scope, element, attrs) {

    }
  };
});
