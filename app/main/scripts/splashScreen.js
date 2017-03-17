'use strict';
angular.module('main')
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    setTimeout(function() {
      if(navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
    }, 500);
  });
});