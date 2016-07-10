'use strict';
angular.module('main')
.factory('CutStepCombinationService', ['_', function (_) {
  var service = {};

  function haveSameCutMethod(stepListStep, stepToPlace) {
    return stepListStep.actionType === stepToPlace.actionType;
  }

  function addToStep(receivingArrElem, stepToAddArr, stepToAddIndex) {
    //initial text adjustment needed?
    if(!receivingArrElem.hasStepsAdded) {
      //then add one time text
      var actionTypeIndex = receivingArrElem.text.indexOf(receivingArrElem.actionType);
      actionTypeIndex += receivingArrElem.actionType.length;
      //insert 'some of ' using slice
      receivingArrElem.text = receivingArrElem.text.slice(0, actionTypeIndex) +  
        " some of" + receivingArrElem.text.slice(actionTypeIndex);
      var amendingText;
      if(receivingArrElem.hasBeenAmended) {
        //then separate the amended text for reattachment after insertion later
        var amendingTextIndex = receivingArrElem.text.indexOf(". Leave");
        amendingText = receivingArrElem.text.slice(amendingTextIndex);
        receivingArrElem.text = receivingArrElem.slice(0, amendingTextIndex);
      }
      //recipeCategorys
      //regardless of whether or not there is an actionModifier, in this condition,
      //we're just adding to the end of the string
      //Though, what if there are multiple actionModifiers? For now, we're just going to
      //arbitrarily use the first one there and ignore the other ones...
      receivingArrElem.text += " for use in the ";
      //need total length of both...
      receivingArrElem.recipeCategorys = receivingArrElem.recipeCategorys.concat(stepToAddArr[stepToAddIndex].recipeCategorys);
      var countedRecipes = _.countBy(receivingArrElem.recipeCategorys);
      console.log("countedRecipes: ", countedRecipes);
      var countedRecipeKeys = Object.keys(countedRecipes);
      console.log("countedRecipeKeys: ", countedRecipeKeys);
      switch(countedRecipeKeys.length) {
        case 0:
          //error - expecting recipeCategorys
          console.log("CutStepCombinationService error: expected more than 0 recipeCategorys: ", receivingArrElem.recipeCategorys);
          break;

        case 1:
          //is this actually an error case?
          if(countedRecipes[countedRecipeKeys[0]] > 1) {
            receivingArrElem.text += countedRecipeKeys[0] + "s";
          } else {
            receivingArrElem.text += countedRecipeKeys[0];
          }
          break;

        case 2:
          if(countedRecipes[countedRecipeKeys[0]] > 1) {
            receivingArrElem.text += countedRecipeKeys[0] + "s";
          } else {
            receivingArrElem.text += countedRecipeKeys[0];
          }
          receivingArrElem.text += " and ";
          if(countedRecipes[countedRecipeKeys[1]] > 1) {
            receivingArrElem.text += countedRecipeKeys[1] + "s";
          } else {
            receivingArrElem.text += countedRecipeKeys[1];
          }
          break;

        default:
          for (var i = countedRecipeKeys.length - 1; i >= 0; i--) {
            if(i === 0) {
              if(countedRecipes[countedRecipeKeys[i]] > 1) {
                receivingArrElem.text += "and " + countedRecipeKeys[i] + "s";
              } else {
                receivingArrElem.text += "and " + countedRecipeKeys[i];
              }
            } else {
              if(countedRecipes[countedRecipeKeys[i]] > 1) {
                receivingArrElem.text += countedRecipeKeys[i] + "s, ";
              } else {
                receivingArrElem.text += countedRecipeKeys[i] + ", ";
              }
            }
          }
          break;
      }
      //add back on amended text
      if(amendingText) {
        receivingArrElem.text += amendingText;
      }
      receivingArrElem.hasStepsAdded = true;
      //take out from stepToAddArr
      _.pullAt(stepToAddArr, [stepToAddIndex]);
    } else {
      //if amendingText, separate
      var amendingText;
      if(receivingArrElem.hasBeenAmended) {
        //then separate the amended text for reattachment after insertion later
        var amendingTextIndex = receivingArrElem.text.indexOf(". Leave");
        amendingText = receivingArrElem.text.slice(amendingTextIndex);
        receivingArrElem.text = receivingArrElem.slice(0, amendingTextIndex);
      }
      //then just need to redo the recipeCategories
      //will need to handle case where other cutMethods mentioned...
      var endIndex = receivingArrElem.text.indexOf("for use in the ") + "for use in the ".length;
      receivingArrElem.text = receivingArrElem.text.slice(0, endIndex);
      receivingArrElem.recipeCategorys = receivingArrElem.recipeCategorys.concat(stepToAddArr[stepToAddIndex].recipeCategorys);
      var countedRecipes = _.countBy(receivingArrElem.recipeCategorys);
      console.log("countedRecipes: ", countedRecipes);
      var countedRecipeKeys = Object.keys(countedRecipes);
      console.log("countedRecipeKeys: ", countedRecipeKeys);
      switch(countedRecipeKeys.length) {
        case 0:
          //error - expecting recipeCategorys
          console.log("CutStepCombinationService error: expected more than 0 recipeCategorys:", receivingArrElem.recipeCategorys);
          break;

        case 1:
          //could actually be an error case...
          if(countedRecipes[countedRecipeKeys[0]] > 1) {
            receivingArrElem.text += countedRecipeKeys[0] + "s";
          } else {
            receivingArrElem.text += countedRecipeKeys[0];
          }
          break;

        case 2:
          if(countedRecipes[countedRecipeKeys[0]] > 1) {
            receivingArrElem.text += countedRecipeKeys[0] + "s";
          } else {
            receivingArrElem.text += countedRecipeKeys[0];
          }
          receivingArrElem.text += " and ";
          if(countedRecipes[countedRecipeKeys[1]] > 1) {
            receivingArrElem.text += countedRecipeKeys[1] + "s";
          } else {
            receivingArrElem.text += countedRecipeKeys[1];
          }
          break;

        default:
          for (var i = countedRecipeKeys.length - 1; i >= 0; i--) {
            if(i === 0) {
              if(countedRecipes[countedRecipeKeys[i]] > 1) {
                receivingArrElem.text += "and " + countedRecipeKeys[i] + "s";
              } else {
                receivingArrElem.text += "and " + countedRecipeKeys[i];
              }
            } else {
              if(countedRecipes[countedRecipeKeys[i]] > 1) {
                receivingArrElem.text += countedRecipeKeys[i] + "s, ";
              } else {
                receivingArrElem.text += countedRecipeKeys[i];
              }
            }
          }
          break;
      }
      if(amendingText) {
        receivingArrElem.text += amendingText;
      }
      _.pullAt(stepToAddArr, [stepToAddIndex]);
    }
  }

  function getActionTypeGerund(actionType) {
    switch(actionType) {
      case "Cut": 
        return "cutting";
      case "Chop":
        return "chopping";
      case "Dice":
        return "dicing";
      case "Slice":
        return "slicing";
      case "Mince":
        return "mincing";
      default:
        break;
    }
  }

  function amendStep(receivingArrElem, amendingArrElem) {
    if(receivingArrElem.hasBeenAmended) {
      receivingArrElem.otherActionTypes.push(amendingArrElem.actionType);
      var prefixIndex = receivingArrElem.text.indexOf("Leave the rest for ") + 
        "Leave the rest for ".length;
      receivingArrElem.text = receivingArrElem.text.slice(0, prefixIndex);
      switch(receivingArrElem.otherActionTypes.length) {
        case 0:
          //error case
          console.log("CutStepCombinationService error: was expecting elements in otherActionTypes:", receivingArrElem);
          break;

        case 1:
          receivingArrElem.text += getActionTypeGerund(receivingArrElem.otherActionTypes[0]);
          break;

        case 2:
          receivingArrElem.text += getActionTypeGerund(receivingArrElem.otherActionTypes[0]) +
            " and " + getActionTypeGerund(receivingArrElem.otherActionTypes[1]);
            break;

        default:
          for (var i = receivingArrElem.otherActionTypes.length - 1; i >= 0; i--) {
            if(i === 0) {
              receivingArrElem.text += "and " + getActionTypeGerund(receivingArrElem.otherActionTypes[i]);
            } else {
              receivingArrElem.text += getActionTypeGerund(receivingArrElem.otherActionTypes[i]) + ", ";
            }
          }
          break;
      }
    } else {
      receivingArrElem.otherActionTypes = [amendingArrElem.actionType];
      receivingArrElem.text += ". Leave the rest for " + getActionTypeGerund(amendingArrElem.actionType);
      receivingArrElem.hasBeenAmended = true;
    }
  }

  function insertStepElem(receivingTextArr, receivingIndex, insertingTextArr, insertingIndex) {
    //insert into array
    receivingTextArr.splice(receivingIndex + 1, 0, insertingTextArr[insertingIndex]);
    //remove from original
    _.pullAt(insertingTextArr, insertingIndex);
  }

  service.addCutStep = function(stepList, step) {
    var cutIndex = _.findIndex(stepList, function(iterStep) {
      return iterStep.stepType === 'Cut'; 
    });
    if(!step.isEmpty && cutIndex !== -1) {
      console.log("cutStep:", step);
      for (var i = step.textArr.length - 1; i >= 0; i--) {
        var stepMatchIndex = _.findIndex(stepList, function(iterStep) {
          //iterStep's textArr has an element that has matching ingredient
          return _.findIndex(iterStep.textArr, function(arrElem) {
            return arrElem.ingredientName === step.textArr[i].ingredientName;
          }) !== -1;
        }, cutIndex);
        if(stepMatchIndex !== -1) {
          //then find the appropriate element of textArr
          var textArrIndex = _.findIndex(stepList[stepMatchIndex].textArr, function(arrElem) {
            return arrElem.ingredientName === step.textArr[i].ingredientName;
          });
          if(haveSameCutMethod(stepList[stepMatchIndex].textArr[textArrIndex], step.textArr[i])) {
            addToStep(stepList[stepMatchIndex].textArr[textArrIndex], step.textArr, i);
          } else {
            //then amend step - different cutMethods for same ingredient
            //and insert step immediately after the one being amended
            amendStep(stepList[stepMatchIndex].textArr[textArrIndex], step.textArr[i]);
            insertStepElem(stepList[stepMatchIndex].textArr, textArrIndex, step.textArr, i);
          }
        }
      }
      if(step.textArr.length > 0) {
        //push to end of cutSteps... or merely just after the current cutStep
        stepList.splice(cutIndex + 1, 0, step);
      }
    } else {
      stepList.push(step);
    }
  };

  return service;
}]);