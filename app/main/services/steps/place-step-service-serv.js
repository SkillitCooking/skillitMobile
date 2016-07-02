'use strict';
angular.module('main')
.factory('placeStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  //ingredientInputs ==> ingredientsToPlace
  //dishProductInput ==> dishToPlaceOn, alreadyPlacedIngredients
  function instantiateStep(step, recipe) {
    step.ingredientsToPlace = [];
    step.alreadyPlacedIngredients = [];
    var ingredientInputs = step.stepInputs["ingredientInputs"];
    var dishProductInput = step.stepInputs["dishProductInput"];
    //get ingredientInputs
    for (var i = ingredientInputs.length - 1; i >= 0; i--) {
      var input = ingredientInputs[i];
      switch(input.sourceType) {
        case "IngredientList":
          var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
            return type.typeName === input.key;
          });
          if(ingredientType) {
            if(ingredientType.ingredients.length > 0) {
              var concatIngredients;
              if(recipe.recipeType !== 'BYO') {
                concatIngredients = ingredientType.ingredients;
              } else {
                concatIngredients = _.filter(ingredientType.ingredients, function(ingredient){
                  return ingredient.useInRecipe;
                });
              }
              step.ingredientsToPlace = step.ingredientsToPlace.concat(concatIngredients);
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              //may need to instantiate ingredients...
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(concatIngredients);
            }
          } else {
            //error: no ingredientType for the input
            console.log("placeStepService error: no ingredientType for input: ", input);
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function (iterStep){
            return iterStep.stepId === input.sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products) {
                step.ingredientsToPlace = step.ingredientsToPlace.concat(referencedStep.products[input.key].ingredients);
                if(!step.products) {
                  step.products = {};
                  step.products[step.productKeys[0]] = {
                    ingredients: []
                  };
                }
                step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(referencedStep.products[input.key].ingredients);
              } else {
                //error: then no products for step
                console.log("placeStepService error: no products for referenced step: ", referencedStep);
              }
            }
          } else {
            //error: then no step found
            console.log("placeStepService error: no step found for input: ", input);
          }
          break;

        default:
          //error unexpected sourceType
          console.log("placeStepService error: unexpected sourceType: ", input);
          break;
      }
    }
    //get dishProductInput
    switch(dishProductInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishProductInput.key;
        });
        if(dish) {
          step.dishToPlaceOn = dish;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {
              ingredients: []
            };
          }
          step.products[step.productKeys[0]].dishes = [step.dishToPlaceOn];
        } else {
          //error: no dish found
          console.log("placeStepService error: no dish found for input: ", dishProductInput);
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === dishProductInput.sourceId;
        });
        console.log("place referencedStep:", referencedStep);
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.dishToPlaceOn = referencedStep.products[dishProductInput.key].dishes[0];
              step.alreadyPlacedIngredients = referencedStep.products[dishProductInput.key].ingredients;
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: []
                };
              }
              step.products[step.productKeys[0]].ingredients = step.products[step.productKeys[0]].ingredients.concat(step.alreadyPlacedIngredients);
              step.products[step.productKeys[0]].dishes = [step.dishToPlaceOn];
            } else {
              //error - no products for step
              console.log("placeStepService error: no products for referencedStep: ", referencedStep);
            }
          }
        } else {
          //error then step couldn't be located
          console.log("placeStepService error: step could not be found from input: ", dishProductInput);
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("placeStepService error: unexpected sourceType from input: ", dishProductInput);
        break;
    }
    //isEmpty condition
    if(step.ingredientsToPlace.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set StepTips
    //Do we want to conflate the two types of ingredients for issuing a stepList?
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToPlace.concat(step.alreadyPlacedIngredients));
    }
  }

  function constructStepText(step) {
    console.log("place step", step);
    if(!step.isEmpty) {
      var placeType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "placeType";
      }).val;
      var placeModifier = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "placeModifier";
      }).val;
      var stepText = placeType + " the ";
      switch(step.ingredientsToPlace.length) {
        case 0:
          //error
          console.log("placeStepService error: no ingredientsToPlace: ", step);
          break;

        case 1:
          stepText += step.ingredientsToPlace[0].name.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToPlace[0].name.toLowerCase() + " and " + step.ingredientsToPlace[1].name.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToPlace.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToPlace[i].name.toLowerCase();
            } else {
              stepText += step.ingredientsToPlace[i].name.toLowerCase() + ", ";
            }
          }
          break;
      }
      switch(placeType) {
        case "Add":
          stepText += " to ";
          break;
        case "Combine":
        case "Mix":
          stepText += " with ";
          break;
        case "Place":
          stepText += " on ";
          break;
        default:
          //error - unexpected placeType
          console.log("placeStepService error: unexpected placeType: ", placeType);
          break;
      }
      if(step.alreadyPlacedIngredients.length > 1) {
        stepText += "the ";
      } else {
        stepText += "a ";
      }
      console.log("step text", stepText);
      stepText += step.dishToPlaceOn.name.toLowerCase();
      switch(step.alreadyPlacedIngredients.length) {
        case 0:
          break;

        case 1:
          stepText += " with " + step.alreadyPlacedIngredients[0].name.toLowerCase();
          break;

        case 2:
          stepText += " with " + step.alreadyPlacedIngredients[0].name.toLowerCase() + " and " +
            step.alreadyPlacedIngredients[1].name.toLowerCase();
          break;

        default:
          stepText += " with ";
          for (var i = step.alreadyPlacedIngredients.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.alreadyPlacedIngredients[i].name.toLowerCase();
            } else {
              stepText += step.alreadyPlacedIngredients[i].name.toLowerCase() + ", ";
            }
          }
          break;
      }
      if(placeModifier !== "") {
        stepText += " and " + placeModifier;
      }
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate
    instantiateStep(step, recipe);
    //construct
    constructStepText(step);
  };

  return service;
}]);
