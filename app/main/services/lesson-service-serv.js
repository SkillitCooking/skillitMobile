'use strict';
angular.module('main')
.factory('LessonService', function (Restangular) {

  var baseLessons = Restangular.all('lessons');

  return {
    getLessonsWithIds: function(lessonIds) {
      return baseLessons.customPOST(lessonIds, 'getLessonsWithIds');
    }
  };

});
