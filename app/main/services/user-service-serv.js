'use strict';
angular.module('main')
.factory('UserService', function (Restangular) {
  var baseUsers = Restangular.all('users');

  return {
    socialLogin: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'socialLogin');
    },
    socialSignup: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'socialSignup');
    },
    emailLogin: function(userInfo) {
      return baseUsers.customPOST(userInfo, 'emailLogin');
    },
    emailSignup: function(userInfo) {
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
