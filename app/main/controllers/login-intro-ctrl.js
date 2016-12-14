'use strict';
angular.module('main')
.controller('LoginIntroCtrl', ['$scope', '$ionicTabsDelegate', '$ionicNavBarDelegate', '$stateParams', '$ionicHistory', function ($scope, $ionicTabsDelegate, $ionicNavBarDelegate, $stateParams, $ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    $ionicTabsDelegate.showBar(false);
    $ionicNavBarDelegate.showBar(false);
  });
  $scope.type = $stateParams.type;

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
}]);
