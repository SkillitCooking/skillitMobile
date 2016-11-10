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

  function chapterSort(chapA, chapB) {
    if(chapA.orderingPreference == -1) {
      return 1;
    }
    if(chapB.orderingPreference == -1) {
      return -1;
    }
    if(chapA.orderingPreference < chapB.orderingPreference) {
      return -1;
    }
    if(chapB.orderingPreference < chapA.orderingPreference) {
      return 1;
    }
    return 0;
  }

  ChapterService.getChapters().then(function(res) {
    $scope.chapters = res.data;
    $scope.chapters.sort(chapterSort);
    //round timeEstimate to nearest 5 min
    for (var i = $scope.chapters.length - 1; i >= 0; i--) {
      $scope.chapters[i].timeEstimate = 5 * Math.round($scope.chapters[i].timeEstimate/5);
    }
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
