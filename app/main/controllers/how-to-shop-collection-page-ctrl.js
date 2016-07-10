'use strict';
angular.module('main')
.controller('HowToShopCollectionPageCtrl', ['$scope', '$stateParams', 'HowToShopService', '$ionicLoading', '$ionicNavBarDelegate', '$ionicHistory', function ($scope, $stateParams, HowToShopService, $ionicLoading, $ionicNavBarDelegate, $ionicHistory) {
  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
  });

  HowToShopService.getHowToShopForCollection($scope.collection._id).then(function(howToShops) {
    $scope.items = howToShops.data;
    setTimeout(function() {
      $ionicLoading.hide();
    }, 200);
  }, function(response) {
    console.log("Server Error: ", response);
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
