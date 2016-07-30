'use strict';
angular.module('main')
.factory('TrainingVideoService', function (Restangular) {
  var baseTrainingVideos = Restangular.all('trainingVideos');

  return {
    getTrainingVideosForCollection: function(collectionId) {
      return baseTrainingVideos.customPOST({collectionId: collectionId}, 'getTrainingVideosForCollection');
    }
  };

});
