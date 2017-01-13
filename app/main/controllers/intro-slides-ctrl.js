'use strict';
angular.module('main')
.controller('IntroSlidesCtrl', ['$rootScope', '$scope', '$ionicTabsDelegate', '$ionicNavBarDelegate', '$persist', 'INTRO_SLIDES', function ($rootScope, $scope, $ionicTabsDelegate, $ionicNavBarDelegate, $persist, INTRO_SLIDES) {
	$scope.introSlides = INTRO_SLIDES;
	$scope.$on('$ionicView.beforeEnter', function(event, data) {
		$ionicTabsDelegate.showBar(false);
		$ionicNavBarDelegate.showBar(false);
	});
  $scope.$on('$ionicView.afterEnter', function(event, data) {
    $rootScope.redrawSlides = true;
  });
  $scope.$on('$ionicView.afterLeave', function(event, data) {
    $persist.set('HAS_SEEN', 'FIRST_OPEN', true);
  });
}]);
