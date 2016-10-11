'use strict';
angular.module('main')
.directive('youtube', ['YoutubePlayerService', '$timeout', function (YoutubePlayerService, $timeout) {
  return {
    templateUrl: 'main/templates/youtube-i-frame.html',
    restrict: 'E',
    scope: {
      video: '=',
      playerid: '='
    },
    link: function (scope, element, attrs) {

      //Note: this directive is currently set up to only allow the existence of one
      //player at a given time... which works just fine if we're just doing modal
      //popups for this directive, but may need a change if the need for this arises
      
      //Honestly, will want to eventually turn this directive into a reusable component with
      //an isolate scope
      
      //stepVideo is accessible here on scope
      //destroy the player or call appropriate api method on call

      if(YoutubePlayerService.getStatus()) {
        if(scope.youtubePlayer) {
          scope.youtubePlayer.destroy();
        }
        $timeout(function() {
          scope.youtubePlayer = YoutubePlayerService.createPlayer(scope.playerid, scope.video.videoId, scope.video.end);
        });
      }

      scope.$watch('video', function(newValue, oldValue) {
        if(scope.youtubePlayer && scope.youtubePlayer.cueVideoById) {
          //might need timeout on this one...
          $timeout(function() {
            scope.youtubePlayer.cueVideoById({
              videoId: scope.video.videoId,
              endSeconds: parseInt(scope.video.end)
            });
          });
        }
      });

      //modal close event?
      scope.$on('$destroy', function() {
        if(scope.youtubePlayer) {
          scope.youtubePlayer.destroy();
        }
      });

      scope.$on('onPause', function(event) {
        if(scope.youtubePlayer) {
          scope.youtubePlayer.stopVideo();
        }
      });
    }
  };
}]);
