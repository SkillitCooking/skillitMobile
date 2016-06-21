'use strict';
angular.module('main')
.controller('LearnCtrl', ['$scope', '$ionicHistory', '$state', '$ionicNavBarDelegate', function ($scope, $ionicHistory, $state, $ionicNavBarDelegate) {
  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.goStuffGo = function() {
    $state.go('main.list');
  };

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(true);
  });
}]);
