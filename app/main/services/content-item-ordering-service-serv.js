'use strict';
angular.module('main')
.factory('ContentItemOrderingService', function () {
  var service = {};

  service.orderLessonItems = function(currentItems, groupedItems, itemIds) {
    var orderedItems = [];
    var flattenedItems = [];
    var assignItemType = function(item) {
        item.itemType = key;
    };
    for(var key in groupedItems) {
      groupedItems[key].forEach(assignItemType);
      flattenedItems = flattenedItems.concat(groupedItems[key]);
    }
    var findItemIndex = function(item) {
      if(itemIds[i].id === item._id) {
        return true;
      }
      return false;
    };
    for (var i = itemIds.length - 1; i >= 0; i--) {
      var index = flattenedItems.findIndex(findItemIndex);
      orderedItems = orderedItems.concat(flattenedItems.splice(index, 1));
    }
    Array.prototype.push.apply(currentItems, orderedItems);
  };

  return service;
});
