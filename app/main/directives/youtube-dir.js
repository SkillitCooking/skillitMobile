'use strict';
angular.module('main')
.directive('youtube', function ($window) {
  return {
    templateUrl: 'main/templates/youtube-i-frame.html',
    restrict: 'E',
    scope: true,
    link: function (scope, element, attrs) {
      
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;

      function stateChange(event) {
        console.log("Did this make it?");
        scope.$apply(function() {
          console.log("state change event: ", event);
          scope.$emit("test", event);
          if(event.data === YT.PlayerState.ENDED) {
            console.log("onStateChange");
          }
        });
      }

      function onReady(event) {
        console.log("READY... FUCK");
      }

      $window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('modal-player', {
          events: {
            'onReady': onReady
          }
        });
        console.log("hur dood: ", player);
        player.addEventListener('onStateChange', stateChange);
        console.log("hir dood: ", player);
      };
    }
  };
});
