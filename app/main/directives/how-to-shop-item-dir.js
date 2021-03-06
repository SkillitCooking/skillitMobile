'use strict';
angular.module('main')
.directive('howToShopItem', ['ContentTextService', function (ContentTextService) {
  return {
    templateUrl: 'main/templates/how-to-shop-item.html',
    restrict: 'E',
    scope: {
      item: '=',
      minimizable: '='
    },
    link: function (scope, element, attrs) {
      ContentTextService.processLineBreaks(scope.item);
      ContentTextService.addBolding(scope.item);

      if(scope.minimizable) {
        scope.minimized = true;
      } else {
        scope.minimized = false;
      }

      if(scope.item.pictures && scope.item.pictures.length > 0) {
        scope.displayPictureIndex = 0;
        scope.displayPicture = scope.item.pictures[0];
      }

      scope.noPrevPictures = function() {
        return scope.displayPictureIndex === 0;
      };

      scope.prevPicture = function() {
        scope.displayPictureIndex -= 1;
        scope.displayPicture = scope.item.pictures[scope.displayPictureIndex];
      };

      scope.noNextPictures = function() {
        scope.displayPictureIndex === scope.item.pictures.length - 1;
      };

      scope.nextPicture = function() {
        scope.displayPictureIndex += 1;
        scope.displayPicture = scope.item.pictures[scope.displayPictureIndex];
      };

      scope.toggleMinimized = function() {
        if(scope.minimizable) {
          scope.minimized = !scope.minimized;
        }
      };

    }
  };
}]);
