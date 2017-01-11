'use strict';
angular.module('main')
.factory('SocialSharingService', function ($cordovaSocialSharing, /*$ionicPopup, $rootScope,*/ SHARING) {

  var service = {};

  service.shareMealTwitter = function(recipe) {
    var name;
    if(recipe.mainName) {
      name = recipe.mainName;
    } else {
      name = recipe.name;
    }
    var message = SHARING.MESSAGE1 + name + SHARING.MESSAGE2;
    $cordovaSocialSharing
    .shareViaTwitter(message, recipe.mainPictureURL, SHARING.LINK)
    .then(function(result) {
      //congrats popup
    }, function(err) {
      //unable to share popup...
    });
  };

  service.shareMealFacebook = function(recipe) {
    var name;
    if(recipe.mainName) {
      name = recipe.mainName;
    } else {
      name = recipe.name;
    }
    var message = SHARING.MESSAGE1 + name + SHARING.MESSAGE2;
    $cordovaSocialSharing
    .shareViaFacebook(message, recipe.mainPictureURL, SHARING.LINK)
    .then(function(result) {
      //congrats popup
    }, function(error) {
      //unable to share popup
    });
  };

  return service;

});
