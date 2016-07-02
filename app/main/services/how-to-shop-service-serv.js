'use strict';
angular.module('main')
.factory('HowToShopService', function (Restangular) {
  var baseHowToShop = Restangular.all('howToShopEntries');

  return {
    getHowToShopForCollection: function(collectionId) {
      return baseHowToShop.customPOST({collectionId: collectionId}, 'getHowToShopForCollection');
    }
  };
});
