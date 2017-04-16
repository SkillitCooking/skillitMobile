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
        console.log('res', res);
      }, function(response) {
        ErrorService.logError({error: response, context: 'pushTokenRegister - UserService.registerDevice'});
      });
      return $ionicPush.saveToken(token);
    }
  }, function(err) {
    //save error
    ErrorService.logError({error: err, context: 'pushTokenRegister - $ionicPush.register'});
  }).then(function(token) {
    //do nothing - already have token
  }, function(err) {
    //save error
    ErrorService.logError({error: err, context: 'pushTokenRegister - $ionicPush.saveToken'});
  });
});