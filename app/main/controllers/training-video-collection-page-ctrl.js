'use strict';
angular.module('main')
.controller('TrainingVideoCollectionPageCtrl', ['$scope', '$stateParams', 'TrainingVideoService', '$ionicLoading', '$ionicNavBarDelegate', '$ionicHistory', 'ErrorService', function ($scope, $stateParams, TrainingVideoService, $ionicLoading, $ionicNavBarDelegate, $ionicHistory, ErrorService) {
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
    ErrorService.showErrorAlert();
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
