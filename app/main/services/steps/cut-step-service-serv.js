'use strict';
angular.module('main')
.factory('cutStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  function instantiateStep(step, recipe) {
    //only expect cutIngredientInput
    var input = step.stepInputs["cutIngredientInput"];
    //expects either StepProduct or IngredientList
    switch(input.sourceType) {
      case "IngredientList":
        var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
          return type.typeName === input.key;
        });
        if(ingredientType){
          if(ingredientType.ingredients.length > 0) {
            step.ingredientsToCut = ingredientType.ingredients;
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: step.ingredientsToCut,
              dishes: []
            };
          } else {
            step.isEmpty = true;
          }
        } else {
          //error
          console.log("cutStepService Error: no ingredientType found with input: ", input);
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === input.sourceId;
        });
        if(referencedStep){
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.ingredientsToCut = referencedStep.products[input.key].ingredients;
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: step.ingredientsToCut,
                dishes: []
              };
            } else {
              //then no products for referencedStep, throw error
              console.log("cutStepService Error: no proudcts for referencedStep: ", referencedStep);
            }
          } else {
            step.isEmpty = true;
          }
        } else {
          //can't find step - Error
          console.log("cutStepService Error: cannot find step referenced by input: ", input);
        }
        break;

      default:
        //error for unexpected sourceType
        console.log("cutStepService Error: unexpected sourceType: ", input);
        break;
    }
    //no "global" setting of a StepTip for CutStep, due to its textArr nature
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      step.textArr = [];
      var actionType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "actionType";
      }).val;
      var actionModifier = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "actionModifier";
      }).val;
      for (var i = step.ingredientsToCut.length - 1; i >= 0; i--) {
        var arrElem = {};
        arrElem.text = actionType;
        arrElem.text += " the " + step.ingredientsToCut[i].name;
        if(actionModifier){
          arrElem.text += " " + actionModifier;
        }
        StepTipService.setTipForTextArrElem(arrElem, step.ingredientsToCut[i], step);
        step.textArr.push(arrElem);
      }
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate
    instantiateStep(step, recipe);
    //constructText
    constructStepText(step);
  };

  return service;
}]);
