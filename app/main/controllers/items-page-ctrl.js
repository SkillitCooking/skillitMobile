'use strict';
angular.module('main')
.controller('ItemsPageCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicLoading', '$ionicPlatform', 'ContentItemOrderingService', 'ItemsService', 'LessonService', 'ErrorService', function ($scope, $stateParams, $state, $ionicHistory, $ionicLoading, $ionicPlatform, ContentItemOrderingService, ItemsService, LessonService, ErrorService) {

  $scope.lesson = $stateParams.lesson;
  $scope.chapters = $stateParams.chapters;
  $scope.currentChapterIndex = $stateParams.currentChapterIndex;
  $scope.lessons = $stateParams.lessons;
  $scope.currentLessonIndex = $stateParams.currentLessonIndex;

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

  if($scope.lesson) {
    ItemsService.getItemsWithTypesAndIds({items: $scope.lesson.itemIds}).then(function(res) {
      $scope.items = ContentItemOrderingService.orderLessonItems(res.data, $scope.lesson.itemIds);
      setTimeout(function() {
        $ionicLoading.hide();
      }, 200);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  } else {
    //error - we need $scope.lesson
    ErrorService.logError({
      message: "ItemsPageCtrl Controller ERROR: no lesson found/passed by $stateParams",
      params: $stateParams
    });
    ErrorService.showErrorAlert();
  }

  $scope.previousThing = function() {
    //case: first lesson in chapter
    if($scope.currentLessonIndex === 0 && $scope.currentChapterIndex > 0) {
      //then previous chapter page or chapter redirect to article or items
      if($scope.chapters) {
        if($scope.chapters[$scope.currentChapterIndex - 1].lessonIds.length === 1) {
          //then redirect
          $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
          });
          LessonService.getLessonsWithIds({lessonIds: $scope.chapters[$scope.currentChapterIndex - 1].lessonIds}).then(
            function(res) {
              var lesson = res.data[0];
              $ionicLoading.hide();
              if(lesson.isArticle) {
                $state.go('main.articlePage', {articleId: lesson.articleId, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex - 1, lessons: res.data, currentLessonIndex: 0});
              } else {
                $state.go('main.itemsPage', {lesson: lesson, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex - 1, lessons: res.data, currentLessonIndex: 0});
              }
            }, function(response) {
              ErrorService.showErrorAlert();
            });
        } else {
          //then chapter page
          $state.go('main.chapterPage', {chapter: $scope.chapters[$scope.currentChapterIndex - 1], chapters: $scope.chapters, index: $scope.currentChapterIndex - 1});
        }
      }
    } else if($scope.currentLessonIndex > 0) {
      if($scope.lessons) {
        var prevLesson = $scope.lessons[$scope.currentLessonIndex - 1];
        if(prevLesson.isArticle) {
          $state.go('main.articlePage', {articleId: prevLesson.articleId, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex, lessons: $scope.lessons, currentLessonIndex: $scope.currentLessonIndex - 1});
        } else {
          $state.go('main.itemsPage', {lesson: prevLesson, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex, lessons: $scope.lessons, currentLessonIndex: $scope.currentLessonIndex - 1});
        }
      }
    }
  };

  $scope.isFirst = function() {
    if($scope.currentLessonIndex === 0 && $scope.currentChapterIndex === 0) {
      return true;
    }
    return false;
  };

  $scope.nextThing = function() {
    //case: is last lesson in chapter and not last chapter
    if($scope.chapters && $scope.lessons) {
      if($scope.currentLessonIndex === $scope.lessons.length - 1 && $scope.currentChapterIndex < $scope.chapters.length - 1) {
        //then onto next chapter page or redirect
        if($scope.chapters[$scope.currentChapterIndex + 1].lessonIds.length === 1) {
          //then redirect
          $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
          });
          LessonService.getLessonsWithIds({lessonIds: $scope.chapters[$scope.currentChapterIndex + 1].lessonIds}).then(
            function(res) {
              var lesson = res.data[0];
              $ionicLoading.hide();
              if(lesson.isArticle) {
                $state.go('main.articlePage', {articleId: lesson.articleId, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex + 1, lessons: res.data, currentLessonIndex: 0});
              } else {
                $state.go('main.itemsPage', {lesson: lesson, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex + 1, lessons: res.data, currentLessonIndex: 0});
              }
            }, function(response) {
              ErrorService.showErrorAlert();
            });
        } else {
          //then chapter page
          $state.go('main.chapterPage', {chapter: $scope.chapters[$scope.currentChapterIndex + 1], chapters: $scope.chapters, index: $scope.currentChapterIndex + 1});
        }
      } else if($scope.currentLessonIndex < $scope.lessons.length - 1) {
        //then next lesson
        var nextLesson = $scope.lessons[$scope.currentLessonIndex + 1];
        if(nextLesson.isArticle) {
          $state.go('main.articlePage', {articleId: nextLesson.articleId, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex, lessons: $scope.lessons, currentLessonIndex: $scope.currentLessonIndex + 1});
        } else {
          $state.go('main.itemsPage', {lesson: nextLesson, chapters: $scope.chapters, currentChapterIndex: $scope.currentChapterIndex, lessons: $scope.lessons, currentLessonIndex: $scope.currentLessonIndex + 1});
        }
      }
    }
  };

  $scope.isLast = function() {
    if($scope.currentLessonIndex === $scope.lessons.length - 1 && $scope.currentChapterIndex === $scope.chapters.length - 1) {
      return true;
    }
    return false;
  };

  $scope.navigateBack = function() {
    if($scope.lessons.length === 1) {
      $state.go('main.chapters');
    } else {
      $state.go('main.chapterPage', {chapter: $scope.chapters[$scope.currentChapterIndex], chapters: $scope.chapters, index: $scope.currentChapterIndex});
    }
  };
}]);
