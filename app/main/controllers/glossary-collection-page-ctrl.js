'use strict';
angular.module('main')
.controller('GlossaryCollectionPageCtrl', ['$scope', '$stateParams', 'GlossaryService', '$ionicLoading', '$ionicNavBarDelegate', '$ionicHistory', 'ErrorService', function ($scope, $stateParams, GlossaryService, $ionicLoading, $ionicNavBarDelegate, $ionicHistory, ErrorService) {
  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
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
