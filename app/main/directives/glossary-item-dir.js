'use strict';
angular.module('main')
.directive('glossaryItem', ['ContentTextService', function (ContentTextService) {
  return {
    templateUrl: 'main/templates/glossary-item.html',
    restrict: 'E',
    scope: {
      item: '=',
      minimizable: '=',
      listindex: '='
    },
    link: function (scope, element, attrs) {
      ContentTextService.processLineBreaks(scope.item);
      ContentTextService.addBolding(scope.item);

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

      scope.getPlayerId = function() {
        return 'glossaryplayer' + scope.listindex;
      };
    }
  };
}]);
