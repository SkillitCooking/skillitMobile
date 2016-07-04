'use strict';
angular.module('main')
.controller('GlossaryCollectionPageCtrl', ['$scope', '$stateParams', 'GlossaryService', '$ionicLoading', function ($scope, $stateParams, GlossaryService, $ionicLoading) {
  $scope.collection = $stateParams.collection;

  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  GlossaryService.getGlossarysForCollection($scope.collection._id).then(function(items) {
    $scope.items = items.data;
    setTimeout(function() {
      $ionicLoading.hide();
    }, 200);
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
