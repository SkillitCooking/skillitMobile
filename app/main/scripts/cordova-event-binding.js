'use strict';
angular.module('main')
.run(function($rootScope, $document) {
  var events = {
    onPause: 'onPause',
    onResume: 'onResume'
  };

  function publish(eventName, data) {
    $rootScope.broadcast(eventName, data);
  }

  $document.bind('pause', function() {
    publish(events.onPause, null);
  });

  $document.bind('resume', function() {
    publish(events.onResume, null);
  });
});