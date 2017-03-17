'use strict';
angular.module('main')
.controller('ChaptersCtrl', ['$window', '$scope', '$ionicLoading', '$ionicHistory', '$ionicPlatform', '$ionicPopup', '$state', 'ChapterService', 'LessonService', 'ErrorService', 'EXIT_POPUP', 'LOADING', function ($window, $scope, $ionicLoading, $ionicHistory, $ionicPlatform, $ionicPopup, $state, ChapterService, LessonService, ErrorService, EXIT_POPUP, LOADING) {

  $ionicLoading.show({
    template: LOADING.DEFAULT_TEMPLATE,
    noBackdrop: true
  });

  $scope.$on('picture.loaded', function(e) {
    e.stopPropagation();
    $scope.chaptersLoadedCount += 1;
    if($scope.chaptersLoadedCount >= $scope.chaptersLength) {
      setTimeout(function() {
        $ionicLoading.hide();
      }, LOADING.TIMEOUT);
    }
  })

  if(typeof $window.ga !== 'undefined') {
    $window.ga.trackView('Chapters');
  }

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
    $scope.chaptersLength = $scope.chapters.length;
    $scope.chaptersLoadedCount = 0;
    $scope.chapters.sort(chapterSort);
    //round timeEstimate to nearest 5 min
    for (var i = $scope.chapters.length - 1; i >= 0; i--) {
      $scope.chapters[i].timeEstimate = 5 * Math.round($scope.chapters[i].timeEstimate/5);
    }
  }, function(response) {
    ErrorService.showErrorAlert();
  });

  $scope.selectChapter = function(chapter, index) {
    if(chapter.lessonIds.length === 1) {
      $ionicLoading.show({
        template: LOADING.DEFAULT_TEMPLATE,
        noBackdrop: true
      });
      LessonService.getLessonsWithIds({lessonIds: chapter.lessonIds}).then(
        function(res) {
          var lesson = res.data[0];
          $ionicLoading.hide();
          if(lesson.isArticle) {
            $state.go('main.articlePage', {articleId: lesson.articleId, chapters: $scope.chapters, currentChapterIndex: index, lessons: res.data, currentLessonIndex: 0});
          } else {
            $state.go('main.itemsPage', {lesson: lesson, chapters: $scope.chapters, currentChapterIndex: index, lessons: res.data, currentLessonIndex: 0});
          }
        }, function(response) {
          ErrorService.showErrorAlert();
        });
    } else {
      $state.go('main.chapterPage', {chapter: chapter, chapters: $scope.chapters, index: index});
    }
  };

}]);
