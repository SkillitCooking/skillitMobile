'use strict';
angular.module('main')
.directive('dailyTipItem', function () {
  return {
    templateUrl: 'main/templates/daily-tip-item.html',
    restrict: 'E',
    scope: {
      tip: '=',
      showdatefeatured: '=',
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
