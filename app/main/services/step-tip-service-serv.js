'use strict';
angular.module('main')
.factory('StepTipService', ['_', function (_) {
  var service = {};

  function getSubTypes(type) {
    switch(type) {
      case "Cut":
        return ["Cut", "Chop", "Dice", "Slice", "Mince"];

      case "Cook":
        return ["Cook"];

      case "Dry":
        return ["Pat", "Rub"];

      case "EquipmentPrep":
        return ["Grease", "Line"];

      case "Move":
        return ["Move"];

      case "Place":
        return ["Place", "Add", "Combine", "Mix", "Plate"];

      case "Remove":
        return ["Remove"];

      case "Stir":
        return ["Flip", "Stir"];

      default:
        return [];
    }
  }

  function getSubTypeName(type) {
    switch(type) {
      case "Cut":
        return "actionType";

      case "Cook":
        return "cookType";

      case "Dry":
        return "dryMethod";

      case "EquipmentPrep":
        return "prepActionType";

      case "Move":
        return "moveType";

      case "Place":
        return "placeType";

      case "Remove":
        return "removeType";

      case "Stir":
        return "stirType";

      default:
        return "";
    }
  }

  function getSubType(step, subTypeName) {
    return _.find(step.stepSpecifics, function(specific) {
      return specific.propName === subTypeName;
    }).val;
  }

  service.setStepTipInfo = function(step, ingredients) {
    var hasSetHasVideoTrue = false;
    var hasSetHasTipTrue = false;
    step.stepTips = [];
    if(step.stepTip){
      //use presence of text vs. videoURL for both
      step.stepTip.text ? (step.hasTip = true) : (step.hasTip = false);
      step.stepTip.videoURL ? (step.hasVideo = true) : (step.hasVideo = false);
      step.stepTips.push(step.stepTip);
    } else {
      //set the flags to false
      step.hasVideo = false;
      step.hasTip = false;
    }
    //check for ingredientTips
    for (var i = ingredients.length - 1; i >= 0; i--) {
      var ingredientTips = ingredients[i].ingredientTips;
      if(ingredientTips && ingredientTips.length > 0){
        for (var j = ingredientTips.length - 1; j >= 0; j--) {
          //is there an equivalent notion of 'all' for an ingredientTip.stepType?
          if(ingredientTips[j].stepType === step.stepType) {
            if(ingredientTips[j].stepSubType === 'all'){
              //add to stepTips
              if(!step.hasTip) {
                ingredientTips[j].stepTip.text ? (step.hasTip = true) : (step.hasTip = false);
              }
              if(!step.hasVideo) {
                ingredientTips[j].stepTip.videoInfo ? (step.hasVideo = true) : (step.hasVideo = false);
              }
              step.stepTips.push(ingredientTips[j].stepTip);
            } else {
              var subTypeName = getSubTypeName(step.stepType);
              if(subTypeName !== ""){
                var subType = getSubType(step, subTypeName);
                if(subType === ingredientTips[j].stepSubType) {
                  //add to stepTips
                  if(!step.hasTip) {
                    ingredientTips[j].stepTip.text ? (step.hasTip = true) : (step.hasTip = false);
                  }
                  if(!step.hasVideo) {
                    ingredientTips[j].stepTip.videoInfo ? (step.hasVideo = true) : (step.hasVideo = false);
                  }
                  step.stepTips.push(ingredientTips[j].stepTip);
                }
              }
            }
          }
        }
      }
    }
  };

  service.setTipForTextArrElem = function(arrElem, ingredient, step){
    //see if ingredient has ingredientTips
    arrElem.stepTips = [];
    arrElem.hasTip = false;
    arrElem.hasVideo = false;
    if(ingredient.ingredientTips && ingredient.ingredientTips.length > 0){
      for (var i = ingredient.ingredientTips.length - 1; i >= 0; i--) {
        var ingredientTip = ingredient.ingredientTips[i];
        if(ingredientTip.stepType === step.stepType){
          //subType check
          var subTypeName = getSubTypeName(step.stepType);
          if(subTypeName !== ""){
            var subType = getSubType(step, subTypeName);
            if(subType === ingredientTip.stepSubType) {
              //add to stepTips
              if(!arrElem.hasTip){
                ingredientTip.stepTip.text ? (arrElem.hasTip = true) : (arrElem.hasTip = false);
              }
              if(!arrElem.hasVideo) {
                ingredientTip.stepTip.videoInfo ? (arrElem.hasVideo = true) : (arrElem.hasVideo = false);
              }
              arrElem.stepTips.push(ingredientTip.stepTip);
            }
          }
        }
      }
    }
  };

  return service;
}]);
