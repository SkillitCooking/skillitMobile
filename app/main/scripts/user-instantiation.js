'use strict';
angular.module('main')
.run(function($ionicUser, $ionicAuth, UserService, ErrorService, USER, LOGIN) {
  if($ionicAuth.isAuthenticated()) {
    UserService.getPersonalInfo({
      userId: $ionicUser.get(USER.ID),
      token: $ionicAuth.getToken()
    }).then(function(res) {
      if(res.invalidUser) {
        //then logout and clear $ionicUser/$ionicAuth ish
        $ionicAuth.logout();
        $ionicUser.unstore();
        $ionicUser.delete();
      } else {
        var user = res.data;
        $ionicUser.set('dietaryPreferences', user.dietaryPreferences);
      }
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  }
});