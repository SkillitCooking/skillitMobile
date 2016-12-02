'use strict';
angular.module('main')
.factory('YoutubePlayerService', ['$rootScope', function ($rootScope) {
  var service = $rootScope.$new(true);

  service.ready = $rootScope.youtubeReady;

//maybe being broadcast before it can be picked up...
//maybe have the signal set some kind of global state var that can be picked up/
// injected here?
  service.$on('youtubeReady', function(event) {
    service.ready = true;
  });

  service.createPlayer = function(idName, videoId, videoEnd) {
    function onPlayerStateChange(event) {
      $rootScope.$broadcast('youtubeStateChange', videoId, event.data);
    }
    var player = new YT.Player(idName, {
      events: {
        'onStateChange': onPlayerStateChange
      },
      videoId: videoId,
      playerVars: {'end': videoEnd, 'modestbranding': 1, 'rel': 0},
      height: 169,
      width: 300,
    });
    return player;
  };

  service.getStatus = function() {
    return service.ready;
  };

  return service;

}]);
