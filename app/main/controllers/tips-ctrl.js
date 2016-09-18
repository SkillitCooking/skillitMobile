'use strict';
angular.module('main')
.controller('TipsCtrl', ['$scope', '$ionicHistory', '$stateParams', '$state', '$ionicTabsDelegate', 'ItemCollectionService', '$ionicLoading', '$ionicPlatform', '$ionicPopup', 'EXIT_POPUP', 'ErrorService', function ($scope, $ionicHistory, $stateParams, $state, $ionicTabsDelegate, ItemCollectionService, $ionicLoading, $ionicPlatform, $ionicPopup, EXIT_POPUP, ErrorService) {

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
  
  $scope.cameFromHome = $stateParams.cameFromHome;

  ItemCollectionService.getCollectionsForItemType('dailyTip').then(function(collections) {
    $scope.tipCollections = collections.data;
    $ionicLoading.hide();
  }, function(response) {
    ErrorService.showErrorAlert();
  });

  $scope.getItemType = function() {
    return 'dailyTip';
  };

  $scope.navigateBack = function() {
    $ionicHistory.clearCache().then(function() {
      $ionicTabsDelegate.select(0);
    }, function(error) {
      ErrorService.logError({
        message: "Tips Controller ERROR: $ionicHistory clearCache error",
        error: error
      });
      ErrorService.showErrorAlert();
    });
  };
}]);
