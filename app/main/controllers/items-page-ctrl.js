'use strict';
angular.module('main')
.controller('ItemsPageCtrl', ['$scope', '$stateParams', '$ionicHistory', '$ionicLoading', '$ionicPlatform', 'ContentItemOrderingService', 'ItemsService', 'ErrorService', function ($scope, $stateParams, $ionicHistory, $ionicLoading, $ionicPlatform, ContentItemOrderingService, ItemsService, ErrorService) {

  $scope.lesson = $stateParams.lesson;
  console.log('lesson: ', $scope.lesson);

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

  if($scope.lesson) {
    ItemsService.getItemsWithTypesAndIds({items: $scope.lesson.itemIds}).then(function(res) {
      console.log('res', res.data);
      $scope.items = ContentItemOrderingService.orderLessonItems(res.data, $scope.lesson.itemIds);
      console.log('items', $scope.items);
      setTimeout(function() {
        $ionicLoading.hide();
      }, 200);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  } else {
    //error - we need $scope.lesson
    ErrorService.logError({
      message: "ItemsPageCtrl Controller ERROR: no lesson found/passed by $stateParams",
      params: $stateParams
    });
    ErrorService.showErrorAlert();
  }

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
