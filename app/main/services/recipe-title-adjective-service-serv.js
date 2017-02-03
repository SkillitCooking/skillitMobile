'use strict';
angular.module('main')
.factory('RecipeTitleAdjectiveService', function (Restangular) {
  var baseAdjectives = Restangular.all('recipeTitleAdjectives');

  return {
    getAllRecipeTitleAdjectives: function() {
      return baseAdjectives.customGET('/');
    }
  };
});
