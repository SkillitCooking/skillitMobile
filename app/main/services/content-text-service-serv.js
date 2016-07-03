'use strict';
angular.module('main')
.factory('ContentTextService', function () {
  var service = {};

  service.processLineBreaks = function(item) {
    var lines = item.text.split('\n\n');
    item.lines = lines;
  };

  //expects that item already has filled in 'lines' property
  service.addBolding = function(item) {
    for (var i = item.lines.length - 1; i >= 0; i--) {
      var splitLine = item.lines[i].split(':');
      //assumes split either yields 1 or 2 elements
      if(splitLine.length === 1) {
        item.lines[i] = {};
        item.lines[i].copy = splitLine[0];
      } else {
        item.lines[i] = {};
        item.lines[i].toBold = splitLine[0];
        item.lines[i].copy = splitLine[1];
      }
    }
  };

  return service;
});
