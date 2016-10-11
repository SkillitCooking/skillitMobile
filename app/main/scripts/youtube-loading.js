'use strict';
angular.module('main')
.run(function($window, $rootScope) {
  $rootScope.youtubeReady = false;

  $window.onYouTubeIframeAPIReady = function() {
    $rootScope.youtubeReady = true;
    $rootScope.$broadcast('youtubeReady');
  };

  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstTagScript = document.getElementsByTagName('script')[0];
  firstTagScript.parentNode.insertBefore(tag, firstTagScript);
});