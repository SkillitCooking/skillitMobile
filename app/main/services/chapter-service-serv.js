'use strict';
angular.module('main')
.factory('ChapterService', function (Restangular) {
  var baseChapters = Restangular.all('chapters');

  return {
    getChapters: function() {
      return baseChapters.customGET('/');
    }
  };
});
