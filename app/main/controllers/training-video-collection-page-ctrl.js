'use strict';
angular.module('main')
.controller('TrainingVideoCollectionPageCtrl', ['$scope', '$stateParams', 'TrainingVideoService', '$ionicLoading', '$ionicNavBarDelegate', '$ionicHistory', function ($scope, $stateParams, TrainingVideoService, $ionicLoading, $ionicNavBarDelegate, $ionicHistory) {
  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
  });

  TrainingVideoService.getTrainingVideosForCollection($scope.collection._id).then(function(videos) {
    $scope.videos = videos.data;
    $ionicLoading.hide();
  }, function(response) {
    console.log("Server Error: ", response);
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
