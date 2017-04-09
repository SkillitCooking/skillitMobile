'use strict';

angular.module('main')
.run(function($rootScope) {
  $rootScope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    alert(msg.title + ': ' + msg.text);
  });
});