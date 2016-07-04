'use strict';
angular.module('main')
.controller('TipCollectionPageCtrl', ['$scope', '$stateParams', 'DailyTipService', '$ionicLoading', function ($scope, $stateParams, DailyTipService, $ionicLoading) {

  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  DailyTipService.getTipsForCollection($scope.collection._id).then(function(tips) {
    $scope.tips = tips.data;
    $ionicLoading.hide();
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
