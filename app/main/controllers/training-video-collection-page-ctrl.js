'use strict';
angular.module('main')
.controller('TrainingVideoCollectionPageCtrl', ['$scope', '$stateParams', 'TrainingVideoService', function ($scope, $stateParams, TrainingVideoService) {
  $scope.collection = $stateParams.collection;

  TrainingVideoService.getTrainingVideosForCollection($scope.collection._id).then(function(videos) {
    $scope.videos = videos.data;
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
