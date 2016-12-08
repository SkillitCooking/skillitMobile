'use strict';
angular.module('main')
.factory('GlossaryService', function (Restangular) {
  var baseGlossary = Restangular.all('glossaryEntries');

  return {
    getGlossarysForCollection: function(collectionId) {
      return baseGlossary.customPOST({collectionId: collectionId}, 'getGlossarysForCollection');
    }
  };
});
