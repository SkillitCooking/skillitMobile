'use strict';
angular.module('main')
.directive('itemCollections', ['$state', function ($state) {
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
            return 'Daily Tip';
          case 'trainingVideo':
            return 'Training Video';
          case 'howToShop':
            return 'How To Shop';
          case 'glossary':
            return 'Glossary';
          case 'recipe':
            return 'Recipe';
          default:
            //error
            console.log("itemCollections directive error: unexpected itemType: ", scope.itemType);
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
            console.log("itemCollections error: unexpected itemType: ", scope.itemType);
            stateName = 'main.home';
            break;
        }
        $state.go(stateName, {collection: collection});
      };
    }
  };
}]);
