'use strict';
angular.module('main')
.factory('cutStepService', ['_', function (_) {
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
          step.ingredientsToCut = ingredientType.ingredients;
          step.products = {};
          step.products[step.productKeys[0]] = {
            ingredients: step.ingredientsToCut,
            dishes: []
          };
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
          //can't find step - Error
          console.log("cutStepService Error: cannot find step referenced by input: ", input);
        }
        break;

      default:
        //error for unexpected sourceType
        console.log("cutStepService Error: unexpected sourceType: ", input);
        break;
    }
  }

  function constructStepText(step) {
    step.textArr = [];
    var actionType = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "actionType";
    }).val;
    var actionModifier = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "actionModifier";
    }).val;
    for (var i = step.ingredientsToCut.length - 1; i >= 0; i--) {
      var stepText = actionType;
      stepText += " the " + step.ingredientsToCut[i].name;
      if(actionModifier){
        stepText += " " + actionModifier;
      }
      step.textArr.push(stepText);
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
