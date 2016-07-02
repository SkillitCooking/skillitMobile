'use strict';
angular.module('main')
.controller('LearnCtrl', ['$scope', '$ionicHistory', '$state', '$ionicNavBarDelegate', 'ItemCollectionService', function ($scope, $ionicHistory, $state, $ionicNavBarDelegate, ItemCollectionService) {
  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  ItemCollectionService.getCollectionsForItemTypes(['trainingVideo', 'howToShop', 'glossary']).then(function(collections) {
    var collectionGroups = collections.data;
    $scope.trainingVideoCollections = collectionGroups['trainingVideo'];
    $scope.howToShopCollections = collectionGroups['howToShop'];
    $scope.glossaryCollections = collectionGroups['glossary'];
  }, function(response) {
    console.log("Server Error: ", response);
  });

  $scope.trainingVideoSelected = true;
  $scope.howToShopSelected = false;
  $scope.glossarySelected = false;

  $scope.getTrainingVideoClass = function() {
    if(!$scope.trainingVideoSelected) {
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.selectTrainingVideo = function() {
    $scope.trainingVideoSelected = true;
    $scope.howToShopSelected = false;
    $scope.glossarySelected = false;
  };

  $scope.getHowToShopClass = function() {
    if(!$scope.howToShopSelected) {
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.selectHowToShop = function() {
    $scope.howToShopSelected = true;
    $scope.trainingVideoSelected = false;
    $scope.glossarySelected = false;
  };

  $scope.getGlossaryClass = function() {
    if(!$scope.glossarySelected) {
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.selectGlossary = function() {
    $scope.glossarySelected = true;
    $scope.howToShopSelected = false;
    $scope.trainingVideoSelected = false;
  };

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(true);
  });
}]);
