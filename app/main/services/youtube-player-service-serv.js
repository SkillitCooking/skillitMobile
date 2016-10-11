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
    return new YT.Player(idName, {
      events: {},
      videoId: videoId,
      end: parseInt(videoEnd, 10),
      rel: 0,
      modestbranding: 1,
      height: 169,
      width: 300,
    });
  };

  service.getStatus = function() {
    return service.ready;
  };

  return service;

}]);
