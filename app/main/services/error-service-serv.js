'use strict';
angular.module('main')
.factory('ErrorService', ['$state', '$ionicPopup', 'ErrorLoggingService', function ($state, $ionicPopup, ErrorLoggingService) {
  var service = {};

  service.isErrorAlready = false;

  service.showErrorAlert = function() {
    if(!service.isErrorAlready) {
      service.isErrorAlready = true;
      var alertPopup = $ionicPopup.alert({
        title: 'Oopsy Daisy',
        template: 'Something unexpected happened that caused an error... we\'ll be looking into it!',
        cssClass: ''
      });
      alertPopup.then(function(res) {
        //navigate to cook
        $state.go('main.cook', {clearHistory: true, fromError: true});
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
