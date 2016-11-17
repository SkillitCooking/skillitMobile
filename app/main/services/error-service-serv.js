'use strict';
angular.module('main')
.factory('ErrorService', ['$state', '$ionicHistory', '$ionicPopup', 'ErrorLoggingService', function ($state, $ionicHistory, $ionicPopup, ErrorLoggingService) {
  var service = {};

  service.isErrorAlready = false;

  service.showErrorAlert = function() {
    if(!service.isErrorAlready) {
      service.isErrorAlready = true;
      var alertPopup = $ionicPopup.alert({
        title: 'Nobody\'s Perfect',
        template: '<p class="no-ingredient-popup">Mistakes happen in the kitchen...and on our server</p>',
        cssClass: 'popup-alerts'
      });
      alertPopup.then(function(res) {
        //clearHistory and cache and navigate to cook beginning
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache().then(function() {
          $state.go('main.cook', {fromError: true});
        });
      });
    }
  };

  service.toggleIsErrorAlready = function() {
    service.isErrorAlready = !service.isErrorAlready;
  };

  service.logError = function(errInfo) {
    ErrorLoggingService.logError(errInfo).then(function(response) {
      console.log(response.message);
    }, function(response) {
      //don't need to do anything here...
      console.log('Logging error...', response);
    });
  };

  return service;
}]);
