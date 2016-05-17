'use strict';
angular.module('main')
.factory('customStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  function instantiateStep (step, recipe) {
    //not doing anything with inputs currently...
    //instantiate later with more time
    //now, just set up products with a pass along
    var ingredientInputs = step.stepInputs["ingredientInputs"];
    var dishInputs = step.stepInputs["dishInputs"];
    //ingredients
    for (var i = ingredientInputs.length - 1; i >= 0; i--) {
      var ingredientInput = ingredientInputs[i];
      switch(ingredientInput.sourceType) {
        case "IngredientList":
          var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
            return type.typeName === ingredientInput.key;
          });
          if(ingredientType) {
            if(!step.products){
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: [],
                dishes: []
              };
            }
            step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(ingredientType.ingredients);
          } else {
            //error
            console.log("customStepService error: no type found for input: ", ingredientInput);
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === ingredientInput.sourceId;
          });
          if(referencedStep) {
            if(referencedStep.products) {
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  dishes: []
                };
              }
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(referencedStep.products[ingredientInput.key].ingredients);
            } else {
              //error
              console.log("customStepService error: no products for referencedStep: ", referencedStep);
            }
          } else {
            //error
            console.log("customStepService error: no step found for input: ", ingredientInput);
          }
          break;

        default:
          //error
          console.log("customStepService error: unexpected sourceType for ingredientInput: ", ingredientInput);
          break;
      }
    }
    //dishes
    for (var i = dishInputs.length - 1; i >= 0; i--) {
      var dishInput = dishInputs[i];
      switch(dishInput.sourceType) {
        case "EquipmentList":
          var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
            return dish.name === dishInput.key;
          });
          if(dish) {
            if(!step.products) {
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: [],
                dishes: []
              };
            }
            step.products[step.productKeys[0]].dishes.push(dish);
          } else {
            //error
            console.log("customStepService error: no dish found for input: ", dishInput);
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === dishInput.sourceId;
          });
          if(referencedStep) {
            if(referencedStep.products) {
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  dishes: []
                };
              }
              step.products[step.productKeys[0]].dishes.push(referencedStep.products[dishInput.key].dishes[0]);
            } else {
              //error
              console.log("customStepService error: no products for referencedStep: ", referencedStep);
            }
          } else {
            //error
            console.log("customStepService error: no step found from input: ", dishInput);
          }
          break;

        default:
          break;
      }
    }

    //assuming, for now, that there will be no ingredientTips that are
    //either general to all Steps or specific to the Custom type...
    StepTipService.setStepTipInfo(step, []);
  }

  function constructStepText(step) {
    var stepText = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "customStepText";
    }).val;
    step.text = stepText;
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
