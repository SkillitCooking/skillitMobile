'use strict';
angular.module('main')
.directive('itemCollection', function () {
  return {
    templateUrl: 'main/templates/item-collection.html',
    restrict: 'E',
    scope: {
      collection: '=',
      isRecipeCollection: '='
    },
    link: function (scope, element, attrs) {
      
    }
  };
});
