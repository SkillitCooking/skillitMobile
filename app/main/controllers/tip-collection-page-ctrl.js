'use strict';
angular.module('main')
.controller('TipCollectionPageCtrl', ['$scope', '$stateParams', 'DailyTipService', '$ionicLoading', '$ionicNavBarDelegate', '$ionicHistory', function ($scope, $stateParams, DailyTipService, $ionicLoading, $ionicNavBarDelegate, $ionicHistory) {

  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
  });

  DailyTipService.getTipsForCollection($scope.collection._id).then(function(tips) {
    $scope.tips = tips.data;
    $ionicLoading.hide();
  }, function(response) {
    console.log("Server Error: ", response);
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
