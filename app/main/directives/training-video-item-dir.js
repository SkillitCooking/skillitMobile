'use strict';
angular.module('main')
.directive('trainingVideoItem', ['$ionicModal', function ($ionicModal) {
  return {
    templateUrl: 'main/templates/training-video-item.html',
    restrict: 'E',
    scope: {
      video: '='
    },
    link: function (scope, element, attrs) {
      scope.autoplayURL = scope.video.video.url + "&autoplay=1&rel=0";

      scope.getVideoModal = function() {
        $ionicModal.fromTemplateUrl('main/templates/video-modal.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          scope.modal = modal;
          scope.modal.show();
        });
      };

      scope.closeModal = function() {
        scope.modal.hide();
        scope.modal.remove();
      };

      scope.$on('modal.hidden', function() {
        scope.modal.remove();
      });
    }
  };
}]);
