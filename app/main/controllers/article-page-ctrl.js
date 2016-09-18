'use strict';
angular.module('main')
.controller('ArticlePageCtrl', ['$scope', '$stateParams', '$ionicHistory', '$ionicLoading', '$ionicPlatform', '$ionicPopover', 'ArticleTextService', 'ArticleService', 'ContentTextService', 'ErrorService', 'CONTENT_PIECE_TYPES', 'ITEM_TYPES', function ($scope, $stateParams, $ionicHistory, $ionicLoading, $ionicPlatform, $ionicPopover, ArticleTextService, ArticleService, ContentTextService, ErrorService, CONTENT_PIECE_TYPES, ITEM_TYPES) {
    
  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

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
      for (var i = $scope.article.contentSections.length - 1; i >= 0; i--) {
        var section = $scope.article.contentSections[i];
        for (var j = section.contentArray.length - 1; j >= 0; j--) {
          if(section.contentArray[j].type === CONTENT_PIECE_TYPES.TEXT) {
            console.log('piece pre', angular.copy(section.contentArray[j]));
            ArticleTextService.processTextChunks(section.contentArray[j]);
            console.log('piece post', section.contentArray[j]);
          }
        }
      }
      console.log('article', $scope.article);
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
        $scope.tip = textThing.linkedItem;
        console.log('tip', $scope.tip);
        break;
      case ITEM_TYPES.HOWTOSHOP:
        templateUrl = 'main/templates/how-to-shop-popover.html';
        $scope.howToShop = textThing.linkedItem;
        ContentTextService.processLineBreaks($scope.howToShop);
        ContentTextService.addBolding($scope.howToShop);
        console.log('shp', $scope.howToShop);
        break;
      case ITEM_TYPES.GLOSSARY:
        templateUrl = 'main/templates/glossary-popover.html';
        $scope.item = textThing.linkedItem;
        ContentTextService.processLineBreaks($scope.item);
        ContentTextService.addBolding($scope.item);
        break;
      case ITEM_TYPES.TRAININGVIDEO:
        templateUrl = 'main/templates/training-video-popover.html';
        $scope.video = textThing.linkedItem;
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

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);