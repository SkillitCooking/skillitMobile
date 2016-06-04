'use strict';
angular.module('main')
.factory('steamingStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  function instantiateStep(step, recipe) {
    step.ingredientsToSteam = [];
    var ingredientInputs = step.stepInputs["ingredientInputs"];
    var dishInput = step.stepInputs["dishInput"];
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
              step.ingredientsToSteam = step.ingredientsToSteam.concat(ingredientType.ingredients);
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(ingredientType.ingredients);
            }
          } else {
            //error - no ingredientType found
            console.log("steamingStepService error: no ingredientType found with input: ", input);
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === input.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products){
                step.ingredientsToSteam = step.ingredientsToSteam.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: []
                  };
                }
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(referencedStep.products[input.key]);
              } else {
                //error - no products for referencedStep
                console.log("steamingStepService error: no products for referencedStep: ", input);
              }
            }
          } else {
            //error - couldn't find step
            console.log("steamingStepService error: can't find step for input: ", input);
          }
          break;

        default:
          //error - unexpected sourceType
          console.log("steamingStepService error: unexpected sourceType: ", input);
          break;
      }
    }
    //get dishes
    switch(dishInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishInput.key;
        });
        if(dish) {
          step.steamingDish = dish;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: []
            };
          }
          step.products[step.productKeys[0]].dishes = [step.steamingDish];
        } else {
          //error - no dish found
          console.log("steamingStepService error: no dish for the input found: ", input);
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return dishInput.sourceId === iterStep.stepId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products) {
              step.steamingDish = referencedStep.products[dishInput.key].dishes[0];
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].dishes = [step.steamingDish];
            } else {
              //error - no products for step
              console.log("steamingStepService error: no products for referencedStep", dishInput);
            }
          }
        } else {
          //error - no step found
          console.log("steamingStepService error: no step found for input ", dishInput);
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("steamingStepService error: unexpected sourceType ", dishInput);
        break;
    }
    //check isEmpty condition
    if(step.ingredientsToSteam.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToSteam);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var steamingDuration = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "steamingDuration";
      }).val;
      var stepText = "Steam the ";
      switch(step.ingredientsToSteam.length) {
        case 0:
          //error - no ingredients
          stepText = "NO INGREDIENTS TO STEAM";
          break;

        case 1:
          stepText += step.ingredientsToSteam[0].name;
          break;

        case 2:
          stepText += step.ingredientsToSteam[0].name + " and " + step.ingredientsToSteam[1].name;
          break;

        default:
          for (var i = step.ingredientsToSteam.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToSteam[i].name;
            } else {
              stepText += step.ingredientsToSteam[i].name + ", ";
            }
          }
          break;
      }
      stepText += " in the " + step.steamingDish.name + " " + steamingDuration;
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiateStep
    instantiateStep(step, recipe);
    //construct step
    constructStepText(step);
  };

  return service;
}]);
