'use strict';
angular.module('main')
.controller('ChapterPageCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$ionicHistory', '$ionicPlatform', 'LessonService', 'ErrorService', 'LOADING', function ($scope, $stateParams, $state, $ionicLoading, $ionicHistory, $ionicPlatform, LessonService, ErrorService, LOADING) {
  
  $scope.chapter = $stateParams.chapter;
  $scope.chapters = $stateParams.chapters;
  $scope.currentIndex = $stateParams.index;

  $ionicLoading.show({
    template: LOADING.TEMPLATE,
    noBackdrop: true
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
    $state.go('main.chapters');
  };

  $scope.selectLesson = function(lesson, index) {
    //two options from here - article or items
    if(lesson.isArticle) {
      $state.go('main.articlePage', {articleId: lesson.articleId, chapters: $scope.chapters, currentChapterIndex: $scope.currentIndex, lessons: $scope.lessons, currentLessonIndex: index});
    } else {
      $state.go('main.itemsPage', {lesson: lesson, chapters: $scope.chapters, currentChapterIndex: $scope.currentIndex, lessons: $scope.lessons, currentLessonIndex: index});
    }
  };

  $scope.previousChapter = function() {
    if($scope.chapters && $scope.currentIndex > 0) {
      if($scope.chapters[$scope.currentIndex - 1].lessonIds.length === 1) {
        $ionicLoading.show({
          template: LOADING.TEMPLATE,
          noBackdrop: true
        });
        LessonService.getLessonsWithIds({lessonIds: $scope.chapters[$scope.currentIndex - 1].lessonIds}).then(
          function(res) {
            var lesson = res.data[0];
            $ionicLoading.hide();
            if(lesson.isArticle) {
              $state.go('main.articlePage', {articleId: lesson.articleId, chapters: $scope.chapters, currentChapterIndex: $scope.currentIndex - 1, lessons: res.data, currentLessonIndex: 0});
            } else {
              $state.go('main.itemsPage', {lesson: lesson, chapters: $scope.chapters, currentChapterIndex: $scope.currentIndex - 1, lessons: res.data, currentLessonIndex: 0});
            }
          }, function(response) {
            ErrorService.showErrorAlert();
        });
      } else {
        $state.go('main.chapterPage', {chapter: $scope.chapters[$scope.currentIndex - 1], chapters: $scope.chapters, index: $scope.currentIndex - 1});
      }
    } 
  };

  $scope.isFirstChapter = function() {
    return $scope.currentIndex === 0;
  };

  $scope.nextChapter = function() {
    if($scope.chapters && $scope.currentIndex < $scope.chapters.length - 1) {
      if($scope.chapters[$scope.currentIndex + 1].lessonIds.length === 1) {
        $ionicLoading.show({
          template: LOADING.TEMPLATE,
          noBackdrop: true
        });
        LessonService.getLessonsWithIds({lessonIds: $scope.chapters[$scope.currentIndex + 1].lessonIds}).then(
          function(res) {
            var lesson = res.data[0];
            $ionicLoading.hide();
            if(lesson.isArticle) {
              $state.go('main.articlePage', {articleId: lesson.articleId, chapters: $scope.chapters, currentChapterIndex: $scope.currentIndex + 1, lessons: res.data, currentLessonIndex: 0});
            } else {
              $state.go('main.itemsPage', {lesson: lesson, chapters: $scope.chapters, currentChapterIndex: $scope.currentIndex + 1, lessons: res.data, currentLessonIndex: 0});
            }
          }, function(response) {
            ErrorService.showErrorAlert();
        });
      } else {
        $state.go('main.chapterPage', {chapter: $scope.chapters[$scope.currentIndex + 1], chapters: $scope.chapters, index: $scope.currentIndex + 1});
      }
    } 
  };

  $scope.isLastChapter = function() {
    if(!$scope.chapters) {
      return false;
    }
    return $scope.currentIndex === $scope.chapters.length - 1;
  };
}]);
