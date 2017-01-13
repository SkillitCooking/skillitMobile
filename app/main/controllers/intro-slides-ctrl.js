'use strict';
angular.module('main')
.controller('IntroSlidesCtrl', ['$rootScope', '$scope', '$ionicTabsDelegate', '$ionicNavBarDelegate', '$persist', 'INTRO_SLIDES', function ($rootScope, $scope, $ionicTabsDelegate, $ionicNavBarDelegate, $persist, INTRO_SLIDES) {
	$scope.introSlides = INTRO_SLIDES;
	$scope.$on('$ionicView.beforeEnter', function(event, data) {
		$persist.set('HAS_SEEN', 'INTRO_SLIDES', true);
    $ionicTabsDelegate.showBar(false);
		$ionicNavBarDelegate.showBar(false);
	});
  $scope.$on('$ionicView.afterEnter', function(event, data) {
    $rootScope.redrawSlides = true;
  });
}]);
