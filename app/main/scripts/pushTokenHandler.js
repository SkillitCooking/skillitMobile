'use strict';

angular.module('main')
.run(function($rootScope) {
  $rootScope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    console.log('data', data);
    alert(msg.title + ': ' + msg.text);
  });
});