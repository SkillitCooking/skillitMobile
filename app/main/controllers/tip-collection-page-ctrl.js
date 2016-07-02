'use strict';
angular.module('main')
.controller('TipCollectionPageCtrl', ['$scope', '$stateParams', 'DailyTipService', function ($scope, $stateParams, DailyTipService) {

  $scope.collection = $stateParams.collection;

  DailyTipService.getTipsForCollection($scope.collection._id).then(function(tips) {
    $scope.tips = tips.data;
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
