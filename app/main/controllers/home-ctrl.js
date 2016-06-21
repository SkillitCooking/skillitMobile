'use strict';
angular.module('main')
.controller('HomeCtrl', ['$scope', '$ionicHistory', '$ionicNavBarDelegate', function ($scope, $ionicHistory, $ionicNavBarDelegate) {
  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.$on("$ionicView.enter", function(event, data) {
    $ionicNavBarDelegate.showBackButton(true);
  });
}]);
