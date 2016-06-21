'use strict';
angular.module('main')
.controller('LearnCtrl', ['$scope', '$ionicHistory', function ($scope, $ionicHistory) {
  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
