'use strict';
angular.module('main')
.factory('RecipeOrderingService', ['_', 'CutStepCombinationService', function (_, CutStepCombinationService) {
  var service = {};

  function isPrepStep(step) {
    switch(step.stepType) {
      case 'Bake':
      case 'Boil':
      //below case may end up getting special handling
      case 'Custom':
      case 'Sautee':
      case 'SlowCook':
      case 'Steam':
        return false;

      case 'BringToBoil':
      case 'Cut':
      case 'Dry':
      case 'EquipmentPrep':
      case 'Heat':
      case 'Place':
      case 'PreheatOven':
      case 'Season':
      case 'Stir':
        return true;

      default:
        //error - unexpected step.stepType
        console.log("RecipeOrderingService error: unrecognized stepType: ", step);
        break;
    }
  }

  service.getGenericCmpRecipeArray = function(recipeA, recipeB) {
    return [service.compPrepCook(recipeA, recipeB), service.compTotalTime(recipeA, recipeB)];
  };

  //so higher values are at the back to be popped
  service.genericCmp = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  };

  service.fullRecipeCmp = function(a, b) {
    var cpyA = angular.copy(a);
    var cpyB = angular.copy(b);
    return service.genericCmp(
      service.getGenericCmpRecipeArray(a, b),
      service.getGenericCmpRecipeArray(b, a)
    );
  };

  //so higher times are at the back to be popped
  service.compTotalTime = function(a, b) {
    if(a.totalTime > b.totalTime) {
      return 1;
    } else if(b.totalTime > a.totalTime) {
      return -1;
    } else {
      return 0;
    }
  };

  //so prep is at the back to be popped
  service.compPrepCook = function(a, b) {
    var aLastStepIndex = a.stepList.length - 1;
    var bLastStepIndex = b.stepList.length - 1;
    if(aLastStepIndex !== -1 && bLastStepIndex !== -1) {
      if(isPrepStep(a.stepList[aLastStepIndex]) && !isPrepStep(b.stepList[bLastStepIndex])){
        return 1;
      } else if(isPrepStep(b.stepList[bLastStepIndex]) && !isPrepStep(a.stepList[aLastStepIndex])) {
        return -1;
      } else {
        return 0;
      }
    } else if(aLastStepIndex !== -1){
      return 1;
    } else if(bLastStepIndex !== -1) {
       return -1;
    } else {
      return 0;
    }
  };

  service.addToStepList = function(stepList, step) {
    //if cut, then find last cutstep in stepList and add
    if(step.stepType === 'Cut'){
      CutStepCombinationService.addCutStep(stepList, step);
    } else {
      stepList.push(step);
    }
  };

  return service;
}]);
