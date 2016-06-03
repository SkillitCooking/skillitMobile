'use strict';
angular.module('main')
.factory('slowCookStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  function instantiateStep(step, recipe) {
    step.ingredientsToSlowCook = [];
    var ingredientInputs = step.stepInputs["ingredientInputs"];
    //get ingredients
    for (var i = ingredientInputs.length - 1; i >= 0; i--) {
      var input = ingredientInputs[i];
      switch(input.sourceType) {
        case "IngredientList":
          var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
            return type.typeName === input.key;
          });
          if(ingredientType) {
            if(ingredientType.ingredients.length > 0) {
              step.ingredientsToSlowCook = step.ingredientsToSlowCook.concat(ingredientType.ingredients);
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  dishes: []
                };
              }
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(ingredientType.ingredients);
            }
          } else {
            //error - no ingredientType found
             console.log("slowCookStepService error: no ingredientType found for input: ", input);
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId = input.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products) {
                step.ingredientsToSlowCook = step.ingredientsToSlowCook.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: [],
                    dishes: []
                  };
                }
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(referencedStep.products[input.key].ingredients);
              } else {
                //error - no product for step
                console.log("slowCookStepService error: no products for referencedStep", referencedStep);
              }
            }
          } else {
            //error - can't find step
            console.log("slowCookStepService error: can't find step from input: ", input);
          }
          break;

        default:
          //error - unexpected sourceType
          console.log("slowCookStepService error: unexpected sourceType: ", input);
          break;
      }
    }
    //set isEmpty condition
    if(step.ingredientsToSlowCook.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToSlowCook);
    }
  }

  function constructStepText(step) {
    if(step.isEmpty) {
      var slowCookDuration = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "slowCookDuration";
      }).val;
      var tempSetting = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "tempSetting";
      }).val;
      var stepText = "Slow cook the ";
      switch(step.ingredientsToSlowCook.length) {
        case 0: 
          //error
          stepText = "NO INGREDIENTS TO SLOW COOK!";
          console.log("slowCookStepService error: no ingredientsToSlowCook");
          break;

        case 1:
          stepText += step.ingredientsToSlowCook[0].name;
          break;

        case 2:
          stepText += step.ingredientsToSlowCook[0].name + " and " + step.ingredientsToSlowCook[1].name;
          break;

        default:
          for (var i = step.ingredientsToSlowCook.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToSlowCook[i].name;
            } else {
              stepText += step.ingredientsToSlowCook[i].name + ", ";
            }
          }
          break;
      }
      stepText += " on " + tempSetting;
      stepText += slowCookDuration;
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //constructStep
    constructStepText(step);
  };

  return service;
}]);
