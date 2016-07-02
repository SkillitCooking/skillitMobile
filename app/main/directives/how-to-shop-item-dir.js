'use strict';
angular.module('main')
.directive('howToShopItem', function () {
  return {
    template: 'main/templates/how-to-shop-item.html',
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

    }
  };
});
