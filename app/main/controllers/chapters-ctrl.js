'use strict';
angular.module('main')
.controller('ChaptersCtrl', ['$scope', '$ionicLoading', '$ionicHistory', '$ionicPlatform', '$ionicPopup', '$state', 'ChapterService', 'ErrorService', 'EXIT_POPUP', function ($scope, $ionicLoading, $ionicHistory, $ionicPlatform, $ionicPopup, $state, ChapterService, ErrorService, EXIT_POPUP) {

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    $ionicPopup.confirm({
      title: EXIT_POPUP.TITLE,
      text: EXIT_POPUP.TEXT
    }).then(function(res) {
      if(res) {
        ionic.Platform.exitApp();
      }
    });
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  ChapterService.getChapters().then(function(res) {
    $scope.chapters = res.data;
    setTimeout(function() {
      $ionicLoading.hide();
    }, 200);
  }, function(response) {
    ErrorService.showErrorAlert();
  });

  $scope.selectChapter = function(chapter) {
    $state.go('main.chapterPage', {chapter: chapter});
  };

}]);
