'use strict';

angular.module('main').run(function($ionicPush) {
  console.log('$ionicPush', $ionicPush);
  $ionicPush.options.debug = true;
  $ionicPush.register().then(function(token) {
    console.log('here: ', token);
    return $ionicPush.saveToken(token /*, {ignore_user: true}*/);
  }, function(err) {
    console.log('error: ', err);
  }).then(function(token) {
    console.log('Token saved:', token.token);
  });
}, function(err) {
  console.log('ereeeerewrewre: ', err);
});