'use strict';
angular.module('main')
.factory('DietaryPreferenceAdjustments', function (_, $ionicUser, $ionicAuth, LOGIN) {
  var service = {};

  var token;
  var loginType = $ionicUser.get(LOGIN.TYPE);
  if(loginType === LOGIN.FACEBOOK || loginType === LOGIN.GOOGLE) {
    token = $ionicUser.get(LOGIN.SOCIALTOKEN);
  } else {
    token = $ionicAuth.getToken();
  }

  service.takeOutIngredients = function(ingredientTypes) {
    if(token) {
      var dietaryPreferences = $ionicUser.get('dietaryPreferences');
      var outlawIngredients = [];
      for (var i = dietaryPreferences.length - 1; i >= 0; i--) {
        outlawIngredients = outlawIngredients.concat(dietaryPreferences[i].outlawIngredients);
      }
      for (var i = ingredientTypes.length - 1; i >= 0; i--) {
        var type = ingredientTypes[i];
        type.ingredients = _.reject(type.ingredients, function(ingredient) {
          return _.some(outlawIngredients, function(ingredName) {
            return ingredName == ingredient.name.standardForm;
          });
        });
      }
    }
  };

  return service;
});
