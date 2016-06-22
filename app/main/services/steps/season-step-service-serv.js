'use strict';
angular.module('main')
.factory('seasonStepService', ['_', 'StepTipService', function (_, StepTipService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var ingredientInput = step.stepInputs["ingredientInput"];
    var dishInput = step.stepInputs["dishInput"];
    //ingredient instantiation
    switch(ingredientInput.sourceType) {
      case "IngredientList":
        var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
          return type.typeName === ingredientInput.key;
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
            step.ingredientsToSeason = concatIngredients;
            if(!step.products){
              step.products = {};
              step.products[step.productKeys[0]] = {};
            }
            step.products[step.productKeys[0]].ingredients = step.ingredientsToSeason;
            step.isEmpty = false;
          } else {
            step.isEmpty = true;
          }
        } else {
          //error: no type found
          console.log("seasonStepService error: no type found for input: ", ingredientInput);
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === ingredientInput.sourceId;
        });
        if(referencedStep){
          if(!referencedStep.isEmpty){
            if(referencedStep.products){
              step.ingredientsToSeason = referencedStep.products[ingredientInput.key].ingredients;
              if (!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {};
              }
              step.products[step.productKeys[0]].ingredients = step.ingredientsToSeason;
              step.isEmpty = false;
            } else {
              //error - no products for step
              console.log("seasonStepService error: no products for step: ", referencedStep);
            }
          } else {
            step.isEmpty = true;
          }
        } else {
          //error - can't find step from input
          console.log("seasonStepService error: can't find step from input: ", ingredientInput);
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("seasonStepService error: unexpected sourceType: ", ingredientInput);
        break;
    }
    //dish instantiation
    switch(dishInput.sourceType) {
      case "EquipmentList":
        var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
          return dish.name === dishInput.key;
        });
        if(dish) {
          step.seasoningDish = dish;
          if(!step.products) {
            step.products = {};
            step.products[step.productKeys[0]] = {};
          }
          step.products[step.productKeys[0]].dishes = [step.seasoningDish];
        } else {
          //error
          console.log("seasonStepService error: could not find dish from input", dishInput);
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === dishInput.sourceId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.seasoningDish = referencedStep.products[dishInput.key].dishes[0];
              if(!step.products) {
                step.products = {};
                step.products[step.productKeys[0]] = {};
              }
              step.products[step.productKeys[0]].dishes = [step.seasoningDish];    
            } else {
              //error - no products for step
              console.log("seasonStepService error: no products for step: ", referencedStep);
            }
          }
        } else {
          //error - no find step from input
          console.log("seasonStepService error: can't find step for input: ", dishInput);
        }
        break;

      default:
        //error - unexpected sourceType
        console.log("seasonStepService error: unexpected sourceType: ", dishInput);
        break;
    }
    //set stepTips
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToSeason);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var isOil = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "isOil";
      }).val;
      var isSeason = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "isSeason";
      }).val;
      var stepText = "";
      if(isOil && isSeason){
        stepText += "Oil and season ";
      } else if (isOil) {
        stepText += "Oil ";
      } else if (isSeason) {
        stepText += "Season ";
      } else {
        //error need oil OR season
        stepText = "NEITHER OIL NOR SEASON";
        console.log("seasonStepService error: neither oil nor season: ", step);
      }
      switch(step.ingredientsToSeason.length) {
        case 0:
          //error
          console.log("seasonStepService error: no ingredientsToSeason: ", step);
          stepText += "NO INGREDIENTS TO SEASON";
          break;

        case 1:
          stepText += step.ingredientsToSeason[0].name.toLowerCase();
          break;

        case 2:
          stepText += step.ingredientsToSeason[0].name.toLowerCase() + " and " + step.ingredientsToSeason[1].name.toLowerCase();
          break;

        default:
          for (var i = step.ingredientsToSeason.length - 1; i >= 0; i--) {
            if(i === 0){
              stepText += "and " + step.ingredientsToSeason[i].name.toLowerCase();
            } else {
              stepText += step.ingredientsToSeason[i].name.toLowerCase() + ", ";
            }
          }
          break;
      }
      step.text = stepText;
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //construct step
    constructStepText(step);
  };

  return service;
}]);
