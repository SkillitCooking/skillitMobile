'use strict';
angular.module('main')
.factory('ItemsService', function (Restangular) {
  var baseItems = Restangular.all('contentItems');

  return {
    getItemsWithTypesAndIds: function(items) {
      return baseItems.customPOST(items, 'getItemsWithTypesAndIds');
    }
  };
});
