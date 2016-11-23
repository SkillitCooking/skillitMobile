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
    	scope.$on('$ionicSlides.sliderInitialized', function(event, data) {
            console.log('data', data);
    		scope.slider = data.slider;
    	});

        scope.slideCount = new Array(scope.slides.length);

        scope.getDotClass = function(slideIndex, index) {
            if(index == slideIndex) {
                return "fa fa-circle fa-lg fa-inverse";
            } else {
                return "fa fa-circle-thin fa-lg fa-inverse";
            }
        };

        scope.goToSlide = function(index) {
            scope.slider.slideTo(index);
        };

        scope.signUp = function() {
            scope.slider.slideTo(scope.slider.slides.length - 1);
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
