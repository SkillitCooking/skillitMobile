'use strict';
angular.module('main')
.controller('LoginIntroCtrl', ['$scope', '$ionicTabsDelegate', '$ionicNavBarDelegate', '$stateParams', function ($scope, $ionicTabsDelegate, $ionicNavBarDelegate, $stateParams) {
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    $ionicTabsDelegate.showBar(false);
    $ionicNavBarDelegate.showBar(false);
  });
  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    $ionicTabsDelegate.showBar(true);
    $ionicNavBarDelegate.showBar(true);
  });
  $scope.type = $stateParams.type;
}]);
