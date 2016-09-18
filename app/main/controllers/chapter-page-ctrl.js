'use strict';
angular.module('main')
.controller('ChapterPageCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$ionicHistory', '$ionicPlatform', 'LessonService', 'ErrorService', function ($scope, $stateParams, $state, $ionicLoading, $ionicHistory, $ionicPlatform, LessonService, ErrorService) {
  
  $scope.chapter = $stateParams.chapter;

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

  if($scope.chapter) {
    LessonService.getLessonsWithIds({lessonIds: $scope.chapter.lessonIds}).then(function(res) {
      $scope.lessons = res.data;
      setTimeout(function() {
        $ionicLoading.hide();
      }, 200);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  } else {
    //error - we need $scope.chapter
    ErrorService.logError({
      message: "ChapterPage Controller ERROR: no chapter found/passed by $stateParams",
      params: $stateParams
    });
    ErrorService.showErrorAlert();
  }

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.selectLesson = function(lesson) {
    //two options from here - article or items
    if(lesson.isArticle) {
      $state.go('main.articlePage', {articleId: lesson.articleId});
    } else {
      $state.go('main.itemsPage', {lesson: lesson});
    }
  };
}]);
