'use strict';
angular.module('main')
.directive('repeatDone', function () {
  return {
    link: function (scope, element, attrs) {
      if(scope.$last) { //all are rendered
        scope.$eval(attrs.repeatDone);
      }
    }
  };
});
