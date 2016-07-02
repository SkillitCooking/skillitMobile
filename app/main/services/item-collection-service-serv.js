'use strict';
angular.module('main')
.factory('ItemCollectionService', function (Restangular) {
  var baseItemCollections = Restangular.all('itemCollections');

  return {
    getCollectionsForItemType: function(itemType) {
      return baseItemCollections.customPOST({itemType: itemType}, 'getCollectionsForItemType');
    },
    getCollectionsForItemTypes: function(itemTypes) {
      return baseItemCollections.customPOST({itemTypes: itemTypes}, 'getCollectionsForItemTypes');
    }
  };

});
