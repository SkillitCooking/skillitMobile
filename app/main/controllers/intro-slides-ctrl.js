'use strict';
angular.module('main')
.controller('IntroSlidesCtrl', ['$rootScope', '$scope', '$ionicTabsDelegate', '$ionicNavBarDelegate', 'INTRO_SLIDES', function ($rootScope, $scope, $ionicTabsDelegate, $ionicNavBarDelegate, INTRO_SLIDES) {
	$scope.introSlides = INTRO_SLIDES;
	$scope.$on('$ionicView.beforeEnter', function(event, data) {
		$ionicTabsDelegate.showBar(false);
		$ionicNavBarDelegate.showBar(false);
	});
  $scope.$on('$ionicView.afterEnter', function(event, data) {
    $rootScope.redrawSlides = true;
  });
	$scope.$on('$ionicView.beforeLeave', function(event, data) {
		$ionicTabsDelegate.showBar(true);
		$ionicNavBarDelegate.showBar(true);
	});
}]);
