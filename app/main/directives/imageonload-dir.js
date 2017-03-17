'use strict';
angular.module('main')
.directive('imageonload', function () {
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, element, attrs) {
    	element.bind('load', function() {
    		scope.$emit('picture.loaded');
    	});
    	element.bind('error', function() {
    		console.log('picture could not be loaded');
    	});
    }
  };
});
