'use strict';
angular.module('main')
.directive('introSlides', ['$window', '$state', function ($window, $state) {
  return {
    templateUrl: 'main/templates/intro-slides-dir.html',
    restrict: 'E',
    scope: {
    	slides: '=',
    	modal: '='
    },
    link: function (scope, element, attrs) {
        scope.data = {};
        scope.slideStartTime = Date.now();
        scope.slideIndex = 0;
    	scope.$watch('data.slider', function(nv, ov) {
    		scope.slider = scope.data.slider;
            if(scope.slider) {
                scope.slideCount = new Array(scope.slider.slides.length);
                scope.currentIndex = 0;
                scope.slider.on('slideChangeEnd', function(swiper) {
                    var interval = Date.now() - scope.slideStartTime;
                    if(typeof $window.ga !== 'undefined') {
                        $window.ga.trackTiming('IntroSlides', interval, scope.slideIndex);
                    }
                    scope.slideStartTime = Date.now();
                    scope.slideIndex = swiper.activeIndex;
                });
            }
    	});

        scope.getDotClass = function(index) {
            if(scope.currentIndex == index) {
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
            var interval = Date.now() - scope.slideStartTime;
            if(typeof $window.ga !== 'undefined') {
              $window.ga.trackTiming('IntroSlides', interval, scope.slideIndex);
              $window.ga.trackEvent('IntroSlides', 'GoToSignUp');
            }
            $state.go('main.loginIntro', {type: 'introSignUp'});
        };

        scope.goToSignIn = function() {
            var interval = Date.now() - scope.slideStartTime;
            if(typeof $window.ga !== 'undefined') {
              $window.ga.trackTiming('IntroSlides', interval, scope.slideIndex);
              $window.ga.trackEvent('IntroSlides', 'GoToSignIn');
            }
            $state.go('main.loginIntro', {type: 'introSignIn'});
        };

        scope.getCooking = function() {
            $state.go('main.cook');
        };

        scope.closeIntro = function() {
            var interval = Date.now() - scope.slideStartTime;
            if(typeof $window.ga !== 'undefined') {
              $window.ga.trackTiming('IntroSlides', interval, scope.slideIndex);
              $window.ga.trackEvent('IntroSlides', 'Skip');
            }
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
