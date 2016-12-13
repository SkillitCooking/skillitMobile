'use strict';
angular.module('main')
.directive('introSlides', ['$state', function ($state) {
  return {
    templateUrl: 'main/templates/intro-slides-dir.html',
    restrict: 'E',
    scope: {
    	slides: '=',
    	modal: '='
    },
    link: function (scope, element, attrs) {
        scope.data = {};
    	scope.$watch('data.slider', function(nv, ov) {
    		scope.slider = scope.data.slider;
            if(scope.slider) {
                scope.slideCount = new Array(scope.slider.slides.length);
            }
    	});

        scope.getDotClass = function(index) {
            if(index == scope.slider.activeIndex) {
                return "fa fa-circle fa-lg fa-inverse";
            } else {
                return "fa fa-circle-thin fa-lg fa-inverse";
            }
        };

        scope.startIntro = function() {
            //index 1 is where the meat of the intro starts
            scope.slider.slideTo(1);
        };

        scope.goToSlide = function(index) {
            scope.slider.slideTo(index);
        };

        scope.goToEnd = function() {
            scope.slider.slideTo(scope.slider.slides.length - 1);
        };

        scope.goToSignUp = function() {
            $state.go('main.loginIntro', {type: 'introSignUp'});
        };

        scope.goToSignIn = function() {
            $state.go('main.loginIntro', {type: 'introSignIn'});
        };

        scope.getCooking = function() {
            $state.go('main.cook');
        };

        scope.closeIntro = function() {
            $state.go('main.cook');
        };

    	scope.getScreenshot = function(slide) {
		    if(ionic.Platform.isAndroid()) {
		      return slide.screenshot_android;
		    } else {
		      return slide.screenshot_ios;
		    }
		};
    }
  };
}]);
