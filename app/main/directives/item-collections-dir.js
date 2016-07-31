'use strict';
angular.module('main')
.directive('itemCollections', ['$state', 'ErrorService', function ($state, ErrorService) {
  return {
    templateUrl: 'main/templates/item-collections.html',
    restrict: 'E',
    scope: {
      collections: '=',
      itemType: '='
    },
    link: function (scope, element, attrs) {
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
