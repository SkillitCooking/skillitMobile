'use strict';
angular.module('main')
.directive('itemCollection', function (LibraryFunctions) {
  return {
    templateUrl: 'main/templates/item-collection.html',
    restrict: 'E',
    scope: {
      collection: '=',
      isRecipeCollection: '='
    },
    link: function (scope, element, attrs) {
      //for now, just get random
      var index = LibraryFunctions.getRandomIndex(scope.collection.pictureURLs.length);
      scope.getPictureURL = function() {
        return scope.collection.pictureURLs[index];
      };

      scope.thereArePictures = function() {
        return scope.collection.pictureURLs && scope.collection.pictureURLs.length > 0;
      };
    }
  };
});
