'use strict';
angular.module('main')
.directive('glossaryItem', function () {
  return {
    templateUrl: 'main/templates/glossary-item.html',
    restrict: 'E',
    scope: {
      item: '=',
      minimizable: '='
    },
    link: function (scope, element, attrs) {
      if(scope.minimizable) {
        scope.minimized = true;
      } else {
        scope.minimized = false;
      }

      scope.toggleMinimized = function() {
        if(scope.minimizable) {
          scope.minimized = !scope.minimized;
        }
      };
    }
  };
});
