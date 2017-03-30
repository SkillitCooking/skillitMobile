'use strict';
angular.module('main')
.factory('UserService', function (Restangular, $rootScope) {
  var baseUsers = Restangular.all('users');

  return {
    registerDevice: function(pushToken, timezoneString) {
      console.log('deviceUUID', $rootScope.deviceUUID);
      var body = {
        pushToken: pushToken,
        timezoneString: timezoneString,
        deviceUUID: $rootScope.deviceUUID
      };
      return baseUsers.customPOST(body, 'registerDevice');
    },
    socialLogin: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'socialLogin');
    },
    socialSignup: function(userInfo) {
      userInfo.deviceUUID = deviceUUID;
      return baseUsers.customPOST(userInfo, 'socialSignup');
    },
    emailLogin: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'emailLogin');
    },
    emailSignup: function(userInfo) {
      userInfo.deviceUUID = deviceUUID;
      return baseUsers.customPOST(userInfo, 'emailSignup');
    },
    logout: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'logout');
    },
    getPersonalInfo: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'getPersonalInfo');
    },
    updatePersonalInfo: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'updatePersonalInfo');
    }
  };
});
