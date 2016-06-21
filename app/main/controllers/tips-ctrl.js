'use strict';
angular.module('main')
.controller('TipsCtrl', ['$scope', '$ionicHistory', function ($scope, $ionicHistory) {
  $scope.list = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
