'use strict';
angular.module('main')
.factory('SocialSharingService', function ($cordovaSocialSharing, /*$ionicPopup, $rootScope,*/ SHARING) {

  var service = {};

  service.shareMeal = function(recipe) {
    var name;
    if(recipe.mainName) {
      name = recipe.mainName;
    } else {
      name = recipe.name;
    }
    $cordovaSocialSharing
    .share(SHARING.MESSAGE, SHARING.SUBJECT, SHARING.FILE, SHARING.LINK)
    .then(function(result) {
      //congrats popup
    }, function(err) {
      //unable to share popup...
    });
  };

  return service;

});
