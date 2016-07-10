'use strict';
angular.module('main')
.controller('TipsCtrl', ['$scope', '$ionicHistory', '$ionicNavBarDelegate', '$stateParams', '$state', '$ionicTabsDelegate', 'ItemCollectionService', '$ionicLoading', function ($scope, $ionicHistory, $ionicNavBarDelegate, $stateParams, $state, $ionicTabsDelegate, ItemCollectionService, $ionicLoading) {

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
  });

  $scope.cameFromHome = $stateParams.cameFromHome;

  ItemCollectionService.getCollectionsForItemType('dailyTip').then(function(collections) {
    $scope.tipCollections = collections.data;
    $ionicLoading.hide();
  }, function(response) {
    console.log("Server Error: ", response);
  });

  $scope.getItemType = function() {
    return 'dailyTip';
  };

  $scope.navigateBack = function() {
    $ionicHistory.clearCache().then(function() {
      $ionicTabsDelegate.select(0);
    }, function(error) {
      console.log("$ionicHistory clearCache error", error);
    });
  };
}]);
