'use strict';
angular.module('main')
.filter('sourceTrusted', ['$sce', function ($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
