'use strict';
angular.module('main')
.controller('ArticlePageCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$ionicHistory', '$ionicLoading', '$ionicPlatform', '$ionicPopover', 'ArticleTextService', 'ArticleService', 'LessonService', 'ContentTextService', 'ErrorService', 'CONTENT_PIECE_TYPES', 'ITEM_TYPES', 'LOADING', function ($rootScope, $scope, $state, $stateParams, $ionicHistory, $ionicLoading, $ionicPlatform, $ionicPopover, ArticleTextService, ArticleService, LessonService, ContentTextService, ErrorService, CONTENT_PIECE_TYPES, ITEM_TYPES, LOADING) {
    
  $ionicLoading.show({
    template: LOADING.TEMPLATE,
    noBackdrop: true
  });

  $scope.chapters = $stateParams.chapters;
  $scope.currentChapterIndex = $stateParams.currentChapterIndex;
  $scope.lessons = $stateParams.lessons;
  $scope.currentLessonIndex = $stateParams.currentLessonIndex;

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    var navigateBack = true;
    if($scope.itemPopover && $scope.itemPopover.isShown()) {
      navigateBack = false;
      $scope.itemPopover.remove();
    }
    if(navigateBack) {
      $scope.navigateBack();
    }
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  if($stateParams.articleId) {
    ArticleService.getArticleFromId($stateParams.articleId).then(function(res){
      $scope.article = res.data;
      $scope.articlePlayers = [];
      for (var i = $scope.article.contentSections.length - 1; i >= 0; i--) {
        var section = $scope.article.contentSections[i];
        for (var j = section.contentArray.length - 1; j >= 0; j--) {
          if(section.contentArray[j].type === CONTENT_PIECE_TYPES.TEXT) {
            ArticleTextService.processTextChunks(section.contentArray[j]);
          }
        }
      }
      setTimeout(function() {
          $ionicLoading.hide();
        }, 200);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  } else {
    //error - we need articleId
    ErrorService.logError({
      message: "ArticlePageCtrl Controller ERROR: no articleId found/passed by $stateParams",
      params: $stateParams
    });
    ErrorService.showErrorAlert();
  }

  $scope.hasSubtitle = function(section) {
    if(section.subTitle && section.subTitle !== "") {
      return true;
    } else {
      return false;
    }
  };

  $scope.containsLink = function(textThing) {
    if(textThing.itemType && textThing.itemType !== ITEM_TYPES.NONE) {
      return true;
    }
    return false;
  };

  $scope.followItemLink = function(textThing, event) {
    var templateUrl;
    switch(textThing.itemType) {
      case ITEM_TYPES.TIP:
        templateUrl = 'main/templates/tip-popover.html';
        $scope.item = textThing.linkedItem;
        break;
      case ITEM_TYPES.HOWTOSHOP:
        templateUrl = 'main/templates/how-to-shop-popover.html';
        $scope.item = textThing.linkedItem;
        ContentTextService.processLineBreaks($scope.item);
        ContentTextService.addBolding($scope.item);
        break;
      case ITEM_TYPES.GLOSSARY:
        templateUrl = 'main/templates/glossary-popover.html';
        $scope.item = textThing.linkedItem;
        ContentTextService.processLineBreaks($scope.item);
        ContentTextService.addBolding($scope.item);
        break;
      case ITEM_TYPES.TRAININGVIDEO:
        templateUrl = 'main/templates/training-video-popover.html';
        $scope.item = textThing.linkedItem;
        break;
      default:
        //error
        ErrorService.logError({
          message: "ArticlePageCtrl Controller ERROR: no linkedItem of unrecognized type in fn followItemLink",
          linkedItem: textThing.linkedItem
        });
        ErrorService.showErrorAlert();
    }
    $ionicPopover.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(popover) {
      $rootScope.redrawSlides = true;
      $scope.itemPopover = popover;
      $scope.itemPopover.show(event);
    });
  };

  $scope.$on('destroy', function() {
    if($scope.itemPopover) {
      $scope.itemPopover.remove();
    }
  });

  $scope.closeItemPopover = function() {
    $scope.itemPopover.remove();
  };

  $scope.getPlayerId = function(index) {
    return 'articleplayer' + index;
  };

  $scope.previousThing = function() {
    //case: first article in chapter
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
    //case: is last article in chapter and not last chapter
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
