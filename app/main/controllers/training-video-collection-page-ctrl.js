'use strict';
angular.module('main')
.controller('TrainingVideoCollectionPageCtrl', ['$scope', '$stateParams', 'TrainingVideoService', '$ionicLoading', function ($scope, $stateParams, TrainingVideoService, $ionicLoading) {
  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  TrainingVideoService.getTrainingVideosForCollection($scope.collection._id).then(function(videos) {
    $scope.videos = videos.data;
    $ionicLoading.hide();
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
