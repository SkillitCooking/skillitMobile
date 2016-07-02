'use strict';
angular.module('main')
.service('TrainingVideoService', function (Restangular) {
  var baseTrainingVideos = Restangular.all('trainingVideos');

  return {
    getTrainingVideosForCollection: function(collectionId) {
      return baseTrainingVideos.customPOST({collectionId: collectionId}, 'getTrainingVideosForCollection');
    }
  };

});
