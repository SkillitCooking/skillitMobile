'use strict';
angular.module('main')
.factory('ErrorLoggingService', function (Restangular) {
  var baseErrorLogging = Restangular.all('clientLogging');

  return  {
    logError: function(errInfo) {
      return baseErrorLogging.customPOST({errInfo: errInfo}, 'logError');
    }
  };
});
