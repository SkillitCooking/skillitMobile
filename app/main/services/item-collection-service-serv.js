'use strict';
angular.module('main')
.factory('ItemCollectionService', function (Restangular) {
  var baseItemCollections = Restangular.all('itemCollections');

  return {
    getCollectionsForItemType: function(itemType, userId, userToken) {
      return baseItemCollections.customPOST({itemType: itemType, userId: userId, userToken: userToken}, 'getCollectionsForItemType');
    },
    getCollectionsForItemTypes: function(itemTypes) {
      return baseItemCollections.customPOST({itemTypes: itemTypes}, 'getCollectionsForItemTypes');
    }
  };

});
