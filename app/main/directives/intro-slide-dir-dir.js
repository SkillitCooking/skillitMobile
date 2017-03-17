'use strict';
angular.module('main')
.directive('introSlide', ['$state', function ($state) {
  return {
    templateUrl: 'main/templates/intro-slide-dir.html',
    restrict: 'E',
    scope: {
    	header: '=',
    	subtitle: '=',
    	screenshot: '=',
    	index: '=',
    	slideCount: '=',
    	modal: '=',
    	slider: '='
    },
    link: function (scope, element, attrs) {
    	scope.slideCount = new Array(scope.slideCount);

    	scope.getDotClass = function(index) {
    		if(index == scope.index) {
    			return "fa fa-circle fa-lg";
    		} else {
    			return "fa fa-circle-thin fa-lg";
    		}
    	};

    	scope.goToSlide = function(index) {
    		scope.slider.slideTo(index);
    	};

    	scope.signUp = function() {
    		if(scope.modal) {
    			scope.modal.remove();
    		}
    		$state.go('main.account');
    	};

    	scope.getCooking = function() {
    		if(scope.modal) {
    			scope.modal.remove();
    		}
    	};
    }
  };
}]);
