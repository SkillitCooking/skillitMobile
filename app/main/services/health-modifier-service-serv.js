'use strict';
angular.module('main')
.factory('HealthModifierService', function (Restangular) {
  var baseHealthModifiers = Restangular.all('healthModifiers');

  return {
    getAllHealthModifiers: function() {
      return baseHealthModifiers.customGET('/');
    }
  };
});
