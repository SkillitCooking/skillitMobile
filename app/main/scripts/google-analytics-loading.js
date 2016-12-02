'use strict';
angular.module('main')
.run(function($ionicPlatform, $window) {
  $ionicPlatform.ready(function() {
    if(typeof $window.ga !== 'undefined') {
      $window.ga.startTrackerWithId('UA-88356931-1');
    } else {
      console.log('no ga!');
    }
  });
});