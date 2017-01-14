'use strict';
angular.module('main')
.controller('ItemsPageCtrl', ['$window', '$scope', '$stateParams', '$state', '$ionicHistory', '$ionicLoading', '$ionicPlatform', 'ContentItemOrderingService', 'ItemsService', 'LessonService', 'ErrorService', 'PAGINATION', 'LOADING', function ($window, $scope, $stateParams, $state, $ionicHistory, $ionicLoading, $ionicPlatform, ContentItemOrderingService, ItemsService, LessonService, ErrorService, PAGINATION, LOADING) {

  $scope.lesson = $stateParams.lesson;
  $scope.chapters = $stateParams.chapters;
  $scope.currentChapterIndex = $stateParams.currentChapterIndex;
  $scope.lessons = $stateParams.lessons;
  $scope.currentLessonIndex = $stateParams.currentLessonIndex;

  if(typeof $window.ga !== 'undefined') {
    $window.ga.trackView('ItemsPage');
  }

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

  $scope.nextPageNumber = 1;

  function getPagedIds() {
    var begin = PAGINATION.ITEMS_PER_PAGE * ($scope.nextPageNumber - 1);
    var end = PAGINATION.ITEMS_PER_PAGE * $scope.nextPageNumber;
    var sliced = $scope.lesson.itemIds.slice(begin, end);
    if(end >= $scope.lesson.itemIds.length) {
      $scope.hideInfiniteScroll = true;
    }
    return sliced;
  }

  $scope.loadMoreItems = function() {
    var pagedIds = getPagedIds();
    ItemsService.getItemsWithTypesAndIds({items: pagedIds}).then(function(res) {
      if(!$scope.items) {
        $scope.items = [];
      }
      ContentItemOrderingService.orderLessonItems($scope.items, res.data, $scope.lesson.itemIds);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      setTimeout(function() {
        $ionicLoading.hide();
      }, 200);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
    $scope.nextPageNumber += 1;
  };

  if($scope.lesson) {
    $scope.loadMoreItems();
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
            template: LOADING.TEMPLATE,
            noBackdrop: true
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
            template: LOADING.TEMPLATE,
            noBackdrop: true
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
    if($scope.lessons && $scope.chapters) {
      if($scope.currentLessonIndex === $scope.lessons.length - 1 && $scope.currentChapterIndex === $scope.chapters.length - 1) {
        return true;
      }
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
