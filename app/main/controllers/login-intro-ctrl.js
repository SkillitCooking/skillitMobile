'use strict';
angular.module('main')
.controller('LoginIntroCtrl', ['$window', '$scope', '$ionicTabsDelegate', '$ionicNavBarDelegate', '$stateParams', '$ionicHistory', function ($window, $scope, $ionicTabsDelegate, $ionicNavBarDelegate, $stateParams, $ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    $ionicTabsDelegate.showBar(false);
    $ionicNavBarDelegate.showBar(false);
  });
  $scope.type = $stateParams.type;

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  if(typeof $window.ga !== 'undefined') {
    $window.ga.trackView('LoginIntro');
  }

}]);
