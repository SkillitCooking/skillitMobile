'use strict';
angular.module('main')
.directive('itemCollections', ['$state', '$rootScope', 'ErrorService', function ($state, $rootScope, ErrorService) {
  return {
    templateUrl: 'main/templates/item-collections.html',
    restrict: 'E',
    scope: {
      collections: '=',
      itemType: '='
    },
    link: function (scope, element, attrs) {
      scope.collectionRows = [];
      function getCollectionRows(collections) {
        var collectionRows = [];
        for (var i = collections.length - 1; i >= 0; i -= 2) {
          var row = [];
          if(i === 0) {
            row.push(collections[i]);
            collectionRows.push(row);
          } else {
            row.push(collections[i]);
            row.push(collections[i - 1]);
            collectionRows.push(row);
          }
        }
        return collectionRows;
      }

      var deregistration = scope.$watch('collections', function(nv, ov) {
        if(nv) {
          scope.collectionRows = getCollectionRows(nv);
          deregistration();
        }
      });

      scope.getItemTypeTitle = function() {
        switch(scope.itemType) {
          case 'dailyTip':
            return 'Kitchen Tips';
          case 'trainingVideo':
            return 'Training Videos';
          case 'howToShop':
            return 'How To Shop';
          case 'glossary':
            return 'Glossary';
          case 'recipe':
            return 'Recipe Categories';
          default:
            //error
            ErrorService.logError({
              message: "Item Collections Directive ERROR: unexpected itemType in function 'getItemTypeTitle'",
              itemType: scope.itemType
            });
            ErrorService.showErrorAlert();
        }
      };

      scope.isRecipeCollection = function() {
        if(scope.itemType === 'recipe') {
          return true;
        } else {
          return false;
        }
      };

      scope.goToCollection = function(collection) {
        var stateName;
        switch(scope.itemType) {
          case 'dailyTip':
            stateName = 'main.tipsCollection';
            break;
          case 'trainingVideo':
            stateName = 'main.trainingVideoCollection';
            break;
          case 'howToShop':
            stateName = 'main.howToShopCollection';
            break;
          case 'glossary':
            stateName = 'main.glossaryCollection';
            break;
          case 'recipe':
            stateName = 'main.recipesCollection';
            break;
          default:
            ErrorService.logError({
              message: "Item Collections Directive ERROR: unexpected itemType in function 'goToCollection'",
              itemType: scope.itemType
            });
            ErrorService.showErrorAlert();
            break;
        }
        $state.go(stateName, {collection: collection});
      };
    }
  };
}]);
