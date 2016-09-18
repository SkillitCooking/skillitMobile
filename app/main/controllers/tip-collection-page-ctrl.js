'use strict';
angular.module('main')
.controller('TipCollectionPageCtrl', ['$scope', '$stateParams', 'DailyTipService', '$ionicLoading', '$ionicHistory', '$ionicPlatform', 'ErrorService', function ($scope, $stateParams, DailyTipService, $ionicLoading, $ionicHistory, $ionicPlatform, ErrorService) {

  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    $scope.navigateBack();
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  DailyTipService.getTipsForCollection($scope.collection._id).then(function(tips) {
    $scope.tips = tips.data;
    $ionicLoading.hide();
  }, function(response) {
    ErrorService.showErrorAlert();
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
