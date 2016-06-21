'use strict';
angular.module('main')
.controller('HomeCtrl', ['$scope', '$ionicHistory', function ($scope, $ionicHistory) {
  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
