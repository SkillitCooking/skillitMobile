'use strict';


/*Resubmit with the debug option turned off...*/
/*Or, could do a hot deploy*/

angular.module('main').run(function($ionicPush, ErrorService, UserService, $rootScope) {

  //set uuid on $rootScope
  ionic.Platform.ready(function() {
    $rootScope.deviceUUID = ionic.Platform.device().uuid;
  });

//$ionicPush.options.debug = true;
  if($ionicPush && typeof $ionicPush.register === 'function') {
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
      //register error
      ErrorService.logError({error: err, context: 'pushTokenRegister - $ionicPush.register'});
    }).then(function(token) {
      //do nothing - already have token
    }, function(err) {
      //save error
      ErrorService.logError({error: err, context: 'pushTokenRegister - $ionicPush.saveToken'});
    });
  }
});