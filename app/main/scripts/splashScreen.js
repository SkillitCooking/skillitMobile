'use strict';
angular.module('main')
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    setTimeout(function() {
      navigator.splashscreen.hide();
    }, 500);
  });
});