'use strict';
angular.module('main')
.controller('HowToShopCollectionPageCtrl', ['$scope', '$stateParams', 'HowToShopService', '$ionicLoading', function ($scope, $stateParams, HowToShopService, $ionicLoading) {
  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  HowToShopService.getHowToShopForCollection($scope.collection._id).then(function(howToShops) {
    $scope.items = howToShops.data;
    setTimeout(function() {
      $ionicLoading.hide();
    }, 200);
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
