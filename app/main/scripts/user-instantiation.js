'use strict';
angular.module('main')
.run(function($ionicUser, $ionicAuth, UserService, ErrorService, USER, LOGIN) {
  var token;
  var loginType = $ionicUser.get(LOGIN.TYPE);
  if(loginType === LOGIN.FACEBOOK || loginType === LOGIN.GOOGLE) {
    token = $ionicUser.get(LOGIN.SOCIALTOKEN);
  } else {
    token = $ionicAuth.getToken();
  }
  if(token) {
    UserService.getPersonalInfo({
      userId: $ionicUser.get(USER.ID),
      token: token
    }).then(function(res) {
      var user = res.data;
      $ionicUser.set('dietaryPreferences', user.dietaryPreferences);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  }
});