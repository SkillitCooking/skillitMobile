'use strict';
angular.module('main')
.directive('chapterItem', function () {
  return {
    templateUrl: 'main/templates/chapter-item.html',
    restrict: 'E',
    scope: {
      chapter: '=',
      index: '='
    },
    link: function (scope, element, attrs) {

    }
  };
});
