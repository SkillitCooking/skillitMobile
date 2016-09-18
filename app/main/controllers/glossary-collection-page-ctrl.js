'use strict';
angular.module('main')
.controller('GlossaryCollectionPageCtrl', ['$scope', '$stateParams', 'GlossaryService', '$ionicLoading', '$ionicHistory', '$ionicPlatform', 'ErrorService', function ($scope, $stateParams, GlossaryService, $ionicLoading, $ionicHistory, $ionicPlatform, ErrorService) {
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

  GlossaryService.getGlossarysForCollection($scope.collection._id).then(function(items) {
    $scope.items = items.data;
    setTimeout(function() {
      $ionicLoading.hide();
    }, 200);
  }, function(response) {
    ErrorService.showErrorAlert();
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
