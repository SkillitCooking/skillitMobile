'use strict';
angular.module('main')
.factory('LibraryFunctions', function () {
  var service = {};

  service.pairArray = function(arr, pairFn) {
    var pairArr = [];
    for (var i = 0; i < arr.length; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        var bound = pairFn.bind(arr[i], '+', arr[j]);
        pairArr.push(bound());
      }
    }
    return pairArr;
  };

  service.isEmpty = function(obj) {
    for(var key in obj) {
      return false;
    }
    return true;
  };

  service.getRandomObjectKey = function(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
  };

  service.getRandomIndex = function(length) {
    return length * Math.random() << 0;
  };

  return service;
});
