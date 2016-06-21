'use strict';
angular.module('main')
.controller('RecipesCtrl', ['$scope', '$ionicHistory', function ($scope, $ionicHistory) {
  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };
}]);
