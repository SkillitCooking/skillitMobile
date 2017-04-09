'use strict';

angular.module('main').run(function($ionicPush, ErrorService, UserService, $rootScope) {

  //set uuid on $rootScope
  ionic.Platform.ready(function() {
    $rootScope.deviceUUID = ionic.Platform.device().uuid;
  });

  $ionicPush.options.debug = true;
  $ionicPush.register().then(function(token) {
    if(token) {
      var timezoneString = moment.tz.guess();
      UserService.registerDevice(token.token, timezoneString).then(function(res) {
        //do nothing
      }, function(response) {
        ErrorService.logError({error: response, context: 'pushTokenRegister - UserService.registerDevice'});
      });
      return $ionicPush.saveToken(token);
    }
  }, function(err) {
    //save error
    ErrorService.logError({error: err, context: 'pushTokenRegister - $ionicPush.register'});
  }).then(function(token) {
    console.log('Token saved:', token.token);
  }, function(err) {
    //save error
    ErrorService.logError({error: err, context: 'pushTokenRegister - $ionicPush.saveToken'});
  });
});