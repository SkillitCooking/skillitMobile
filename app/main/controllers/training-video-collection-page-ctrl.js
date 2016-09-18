'use strict';
angular.module('main')
.controller('TrainingVideoCollectionPageCtrl', ['$scope', '$stateParams', 'TrainingVideoService', '$ionicLoading', '$ionicHistory', '$ionicPlatform', 'ErrorService', function ($scope, $stateParams, TrainingVideoService, $ionicLoading, $ionicHistory, $ionicPlatform, ErrorService) {
  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    $scope.navigateBack();
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  TrainingVideoService.getTrainingVideosForCollection($scope.collection._id).then(function(videos) {
    $scope.videos = videos.data;
    $ionicLoading.hide();
  }, function(response) {
    ErrorService.showErrorAlert();
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
