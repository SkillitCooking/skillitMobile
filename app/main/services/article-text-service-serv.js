'use strict';
//BELOW COULD STAND TO BE REFACTORED IF, FOR ANYTHING, READABILITY AND NOT REPEATING MYSELF
angular.module('main')
.factory('ArticleTextService', ['TEXT_CHUNK_SIGNALS', 'ITEM_TYPES', 'ErrorService', function (TEXT_CHUNK_SIGNALS, ITEM_TYPES, ErrorService) {
  var service = {};

  function notNew(bulletPoint) {
    if(bulletPoint.text) {
      return true;
    }
    if(bulletPoint.hasParts !== undefined) {
      return true;
    }
    return false;
  }

  function useUnorderedSignal(uListStartIndex, oListStartIndex) {
    return (uListStartIndex > -1) && (oListStartIndex === -1 || uListStartIndex < oListStartIndex);
  }

  function processListMode(textChunk, startingIndex, currentTextChunk, newTextChunks, listTypeSignal, currentBulletPoint) {
    //find end signal
    var endSignal;
    currentTextChunk.isList = true;
    if(listTypeSignal === TEXT_CHUNK_SIGNALS.OPENULIST) {
      currentTextChunk.isOrdered = false;
      endSignal = TEXT_CHUNK_SIGNALS.CLOSEULIST;
    } else if(listTypeSignal === TEXT_CHUNK_SIGNALS.OPENOLIST) {
      currentTextChunk.isOrdered = true;
      endSignal = TEXT_CHUNK_SIGNALS.CLOSEOLIST;
    } else {
      //error - need one of the open list signals
      ErrorService.logError({
        message: "ArticleTextService ERROR: got an unexpected listTypeSignal in function processListMode",
        signal: listTypeSignal
      });
      ErrorService.showErrorAlert();
    }
    var endSignalIndex = textChunk.text.indexOf(endSignal, startingIndex);
    var firstBulletPointIndex = textChunk.text.indexOf(TEXT_CHUNK_SIGNALS.NEWBULLET, startingIndex);
    if(endSignalIndex === -1) {
      //then no end signal, will remain in listMode after the processing of this chunk
      if(firstBulletPointIndex === -1) {
        //then we have just a portion of the previously started bullet point, add it all
        if(!currentBulletPoint.hasParts) {
          //then convert to parts
          currentBulletPoint.hasParts = true;
          currentBulletPoint.lineParts = [];
          var firstPart = {
            text: currentBulletPoint.text
          };
          if(currentBulletPoint.itemType && currentBulletPoint.itemType !== ITEM_TYPES.NONE) {
            firstPart.itemType = currentBulletPoint.itemType;
            firstPart.linkedItem = currentBulletPoint.linkedItem;
          }
          currentBulletPoint.lineParts.push(firstPart);
        }
        var part = {
          text: textChunk.text.substring(startingIndex)
        };
        if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
          part.itemType = textChunk.itemType;
          part.linkedItem = textChunk.linkedItem;
        }
        currentBulletPoint.lineParts.push(part);
        //then return - chunk is finished processing
        return {
          currentTextChunk: currentTextChunk,
          currentBulletPoint: currentBulletPoint,
          listMode: true,
          signal: listTypeSignal
        };
      } else {
        //then will have a new bulletpoint, and need to eventually push the previous bulletpoint
        if(firstBulletPointIndex !== startingIndex) {
          //then have a 'hanging part' for currentBulletPoint
          //take from startingIndex, then set startingIndex
          var hangingPart = {
            text: textChunk.text.substring(startingIndex, firstBulletPointIndex - 1)
          };
          if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
            hangingPart.itemType = textChunk.itemType;
            hangingPart.linkedItem = textChunk.linkedItem;
          }
          if(!currentBulletPoint.hasParts) {
            //then need to initialize parts
            currentBulletPoint.hasParts = true;
            currentBulletPoint.lineParts = [];
            var initialPart = {
              text: currentBulletPoint.text
            };
            if(currentBulletPoint.itemType && currentBulletPoint.itemType !== ITEM_TYPES.NONE) {
              //then add items
              initialPart.itemType = currentBulletPoint.itemType;
              initialPart.linkedItem = currentBulletPoint.linkedItem;
            }
            currentBulletPoint.lineParts.push(initialPart);
          }
          currentBulletPoint.lineParts.push(hangingPart);
        }
        //add currentBulletPoint to curTextChunk.bulletPoints - won't need to check for prior text
        if(!currentTextChunk.bulletPoints) {
          currentTextChunk.bulletPoints = [];
        }
        currentTextChunk.bulletPoints.push(currentBulletPoint);
        //process bullet points - first may want to offset starting index by length of signal/marker
        var nextBulletPointIndex;
        var currentBulletPointIndex = firstBulletPointIndex;
        while(currentBulletPointIndex !== -1) {
          currentBulletPointIndex += TEXT_CHUNK_SIGNALS.NEWBULLET.length;
          nextBulletPointIndex = textChunk.text.indexOf(TEXT_CHUNK_SIGNALS.NEWBULLET, currentBulletPointIndex);
          var bulletPoint;
          if(nextBulletPointIndex === -1) {
            //then process until endSignalIndex
            bulletPoint = {
              text: textChunk.text.substring(currentBulletPointIndex)
            };
          } else {
            bulletPoint = {
              text: textChunk.text.substring(currentBulletPointIndex, nextBulletPointIndex - 1)
            };
          }
          if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
            bulletPoint.itemType = textChunk.itemType;
            bulletPoint.linkedItem = textChunk.linkedItem;
          }
          if(nextBulletPointIndex !== -1) {
            currentTextChunk.bulletPoints.push(bulletPoint);
          } else {
            currentBulletPoint = bulletPoint;
          }
          currentBulletPointIndex = nextBulletPointIndex;
        }
        //need to return here
        return {
          currentTextChunk: currentTextChunk,
          currentBulletPoint: currentBulletPoint,
          listMode: true,
          signal: listTypeSignal
        };
      }
    } else {
      //then end signal is present, and will possibly do recursive call to processListMode
      if(firstBulletPointIndex === -1 || firstBulletPointIndex > endSignalIndex) {
        //then we have just a portion of the previously started bullet point - add until the endSignalIndex, then add bulletpoint to textChunk
        if(!currentBulletPoint.hasParts) {
          currentBulletPoint.hasParts = true;
          currentBulletPoint.lineParts = [];
          var firstPart = {
            text: currentBulletPoint.text
          };
          if(currentBulletPoint.itemType && currentBulletPoint.itemType !== ITEM_TYPES.NONE) {
            firstPart.itemType = currentBulletPoint.itemType;
            firstPart.linkedItem = currentBulletPoint.linkedItem;
          }
          currentBulletPoint.lineParts.push(firstPart);
        }
        var part = {
          text: textChunk.text.substring(startingIndex, endSignalIndex - 1)
        };
        if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
          part.itemType = textChunk.itemType;
          part.linkedItem = textChunk.linkedItem;
        }
        currentBulletPoint.lineParts.push(part);
      } else {
        //then has additional bulletpoints
        if(firstBulletPointIndex !== startingIndex) {
          //then have a 'hanging part' for currentBulletPoint
          //take from startingIndex
          var hangingPart = {
            text: textChunk.text.substring(startingIndex, firstBulletPointIndex - 1)
          };
          if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
            hangingPart.itemType = textChunk.itemType;
            hangingPart.linkedItem = textChunk.linkedItem;
          }
          if(!currentBulletPoint.hasParts) {
            //then need to initialize parts
            currentBulletPoint.hasParts = true;
            currentBulletPoint.lineParts = [];
            var initialPart = {
              text: currentBulletPoint.text
            };
            if(currentBulletPoint.itemType && currentBulletPoint.itemType !== ITEM_TYPES.NONE) {
              //then add items
              initialPart.itemType = currentBulletPoint.itemType;
              initialPart.linkedItem = currentBulletPoint.linkedItem;
            }
            currentBulletPoint.lineParts.push(initialPart);
          }
          currentBulletPoint.lineParts.push(hangingPart);
        }
        //add currentBulletPoint to curTextChunk.bulletPoints - won't need to check for prior text
        if(!currentTextChunk.bulletPoints) {
          currentTextChunk.bulletPoints = [];
        }
        if(Object.keys(currentBulletPoint).length !== 0) {
          currentTextChunk.bulletPoints.push(currentBulletPoint);
        }
        //process bullet points - first may want to offset starting index by length of signal/marker
        var nextBulletPointIndex;
        var currentBulletPointIndex = firstBulletPointIndex;
        while(currentBulletPointIndex !== -1 && currentBulletPointIndex < endSignalIndex) {
          currentBulletPointIndex += TEXT_CHUNK_SIGNALS.NEWBULLET.length;
          nextBulletPointIndex = textChunk.text.indexOf(TEXT_CHUNK_SIGNALS.NEWBULLET, currentBulletPointIndex);
          var bulletPoint;
          if(nextBulletPointIndex === -1 || nextBulletPointIndex > endSignalIndex) {
            //then process until endSignalIndex
            bulletPoint = {
              text: textChunk.text.substring(currentBulletPointIndex, endSignalIndex - 1)
            };
          } else {
            bulletPoint = {
              text: textChunk.text.substring(currentBulletPointIndex, nextBulletPointIndex - 1)
            };
          }
          if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
            bulletPoint.itemType = textChunk.itemType;
            bulletPoint.linkedItem = textChunk.linkedItem;
          }
          if(nextBulletPointIndex !== -1 && nextBulletPointIndex < endSignalIndex) {
            currentTextChunk.bulletPoints.push(bulletPoint);
          } else {
            currentBulletPoint = bulletPoint;
          }
          currentBulletPointIndex = nextBulletPointIndex;
        }
      }
      //in either case, will need to push currentTextChunk and currentBulletPoint
      currentTextChunk.bulletPoints.push(currentBulletPoint);
      newTextChunks.push(currentTextChunk);
      //in either case, will need to see what exists, if anything, beyond the end signal
      if(endSignalIndex + endSignal.length >= textChunk.text.length - 1) {
        //then nothing follows the endSignalIndex, need to return appropriately
        //need 
        return {
          currentTextChunk: {},
          signal: listTypeSignal,
          currentBulletPoint: {},
          listMode: false
        };
      } else {
        //then ish follows the endSignalIndex, and need to call processListMode
        var newStartingIndex = endSignalIndex + endSignal.length;
        processNotListMode(textChunk, newStartingIndex, {}, newTextChunks);
      }
    }
  }

  function processNotListMode(textChunk, startingIndex, currentTextChunk, newTextChunks) {
    //detect list start signal
    //if both found, take more recent
    var uListStartIndex = textChunk.text.indexOf(TEXT_CHUNK_SIGNALS.OPENULIST, startingIndex);
    var oListStartIndex = textChunk.text.indexOf(TEXT_CHUNK_SIGNALS.OPENOLIST, startingIndex);
    if(uListStartIndex === -1 && oListStartIndex === -1) {
      //then take all of chunk, and put it into currentTextChunk
      //assumption is that will always be a new currentTextChunk entering non List mode process
      //due to a list just finished being processed or a previous notList chunk having been processed
      currentTextChunk.text = textChunk.text.substring(startingIndex);
      currentTextChunk.isList = false;
      if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
        currentTextChunk.linkedItem = textChunk.linkedItem;
        currentTextChunk.itemType = textChunk.itemType;
      } else {
        currentTextChunk.itemType = ITEM_TYPES.NONE;
      }
      newTextChunks.push(currentTextChunk);
      //textChunk fully processed; return new Object for next currentTextChunk
      return {
        listMode: false,
        currentTextChunk: {},
        currentBulletPoint: {},
        signal: TEXT_CHUNK_SIGNALS.NOLIST
      };
    } else {
      //then at least one list exists
      var signalIndex, signal;
      if(useUnorderedSignal(uListStartIndex, oListStartIndex)) {
        signalIndex = uListStartIndex;
        signal = TEXT_CHUNK_SIGNALS.OPENULIST;
      } else {
        signalIndex = oListStartIndex;
        signal = TEXT_CHUNK_SIGNALS.OPENOLIST;
      }
      //then take text up to signal index for currentTextChunk
      if(signalIndex > 0) {
        currentTextChunk.isList = false;
        currentTextChunk.text = textChunk.text.substring(startingIndex, signalIndex - 1);
        if(textChunk.itemType && textChunk.itemType !== ITEM_TYPES.NONE) {
          currentTextChunk.linkedItem = textChunk.linkedItem;
          currentTextChunk.itemType = textChunk.itemType;
        } else {
          currentTextChunk.itemType = ITEM_TYPES.NONE;
        }
        newTextChunks.push(currentTextChunk);
      }
      //process signal - e.g. increment signalIndex
      var newStartingIndex = signalIndex + signal.length;
      //return eventual result of processList
      return processListMode(textChunk, newStartingIndex, {}, newTextChunks, signal, {});
    }
  }

  service.processTextChunks = function(textPiece) {
    var listMode = false;
    var newTextChunks = [];
    var constructingTextChunk = {};
    var constructingBulletPoint = {};
    var signal = "";
    var retVal;
    for (var i = 0; i < textPiece.textChunks.length; i++) {
      if(listMode) {
        retVal = processListMode(textPiece.textChunks[i], 0, constructingTextChunk, newTextChunks, signal, constructingBulletPoint);
        constructingTextChunk = retVal.currentTextChunk;
        listMode = retVal.listMode;
        signal = retVal.signal;
        constructingBulletPoint = retVal.currentBulletPoint;
      } else {
        retVal = processNotListMode(textPiece.textChunks[i], 0, constructingTextChunk, newTextChunks);
        constructingTextChunk = retVal.currentTextChunk;
        listMode = retVal.listMode;
        signal = retVal.signal;
        constructingBulletPoint = retVal.currentBulletPoint;
      }
    }
    if(listMode) {
      //error - malformed text
      ErrorService.logError({
        message: 'ArticleTextService ERROR: malformed text - listMode still true after iterating through all pieces in processTextChunks',
        textPiece: textPiece
      });
      ErrorService.showErrorAlert();
    }
    //probably need to return newTextChunks...
    textPiece.textChunks = newTextChunks;
  };

  return service;
}]);
