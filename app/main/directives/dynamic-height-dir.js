'use strict';
angular.module('main')
.directive('dynamicHeight', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch (
                function () {
                    var activeSlideElement = angular.element(element[0].getElementsByClassName(attrs.slideChildClass+"-active"));
                    //constantly remove max height from current element to allow it to expand if required
                    activeSlideElement.css("max-height","none");
                    //if activeSlideElement[0] is undefined, it means that it probably hasn't loaded yet
                    return angular.isDefined(activeSlideElement[0])? activeSlideElement[0].offsetHeight : 20 ;
                },
                function (newHeight, oldHeight) {
                    var sildeElements = angular.element(element[0].getElementsByClassName(attrs.slideChildClass));
                    sildeElements.css("max-height",newHeight+"px");
                }
            );
        }
    }
});
