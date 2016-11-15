'use strict';
angular.module('main')
.factory('DietaryPreferencesService', function (Restangular) {

  var baseDietaryPreferences = Restangular.all('dietaryPreferences');

  return {
    getAllDietaryPreferences: function() {
      return baseDietaryPreferences.customGET('/');
    }
  };
});
