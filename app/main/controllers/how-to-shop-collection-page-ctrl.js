'use strict';
angular.module('main')
.controller('HowToShopCollectionPageCtrl', ['$scope', '$stateParams', 'HowToShopService', function ($scope, $stateParams, HowToShopService) {
  $scope.collection = $stateParams.collection;

  HowToShopService.getHowToShopForCollection($scope.collection._id).then(function(howToShops) {
    $scope.items = howToShops.data;
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
