//[removeType] the [ingredientsToRemove]
'use strict';
angular.module('main')
.factory('removeStepService', ['_', 'StepTipService', 'DishInputService', 'GeneralTextService', 'STEP_TYPES', 'ErrorService', function (_, StepTipService, DishInputService, GeneralTextService, STEP_TYPES, ErrorService) {
  var service = {};

  function getIngredientsToRemove(step, referencedStep) {
    var productInput = step.stepInputs['stepInput'];
    var ingredientsToRemove = [];
    var inputIngredients = referencedStep.products[productInput.key].ingredients;
    for (var i = inputIngredients.length - 1; i >= 0; i--) {
      //test if is in one of the StepComposition[key].ingredientRemoveTypes
      //can break if hit - guarans to have only one brah
      for(var key in step.stepComposition) {
        if(step.stepComposition[key].type === 'removeIngredientType') {
          var index = step.stepComposition[key].ingredientTypeKeys.indexOf(inputIngredients[i].typeName);
          if(index !== -1) {
            //then push it in brah... easy but... one big one
            ingredientsToRemove.push(inputIngredients[i]);
          }
        }
      }
    }
    return ingredientsToRemove;
  }

  function getRemoveStepProducts(step, referencedStep) {
    var products = {};
    var inputIngredients = referencedStep.products[step.stepInputs["stepInput"].key];
    var inputIngredientsByType = {};
    //sort input ingredients by typeName
    for (var j = inputIngredients.ingredients.length - 1; j >= 0; j--) {
      if(!inputIngredientsByType.hasOwnProperty([inputIngredients.ingredients[j].typeName])) {
        inputIngredientsByType[inputIngredients.ingredients[j].typeName] = {ingredients: []
        };
      }
      inputIngredientsByType[inputIngredients.ingredients[j].typeName].ingredients.push(inputIngredients.ingredients[j]);
    }
    for (var i = step.productKeys.length - 1; i >= 0; i--) {
      products[step.productKeys[i]] = {
        sourceStepType: STEP_TYPES.REMOVE,
        ingredients: []
      };
      if(step.stepComposition[step.productKeys[i]].type === 'dish') {
        products[step.productKeys[i]].dishes = [step.stepComposition[step.productKeys[i]].dish];
        //NOTE: can I actually set this here???? Will I need to check for emptiness, etc? use DishInputService.findDishProduct appropriately?
        //honestly here will probably not be affected, as this is occurring within a conditional block where !referencedStep.isEmpty
        step.dishRemovedFrom = step.stepComposition[step.productKeys[i]].dish;
      }
      var compositionIngredientTypeKeys = step.stepComposition[step.productKeys[i]].ingredientTypeKeys;
      for (var k = compositionIngredientTypeKeys.length - 1; k >= 0; k--) {
        var productIngredients = angular.copy(inputIngredientsByType[compositionIngredientTypeKeys[k]].ingredients);
        _.forEach(productIngredients, function(ingredient) {
          ingredient.transformationPrefix = "";
          ingredient.hasBeenUsed = true;
        });
        products[step.productKeys[i]].ingredients = products[step.productKeys[i]].ingredients.concat(productIngredients);
      }
    }
    return products;
  }

  function instantiateStep(step, recipe) {
    console.log('da recipe', recipe);
    var productInput = step.stepInputs["stepInput"];
    step.ingredientsToRemove = [];
    switch(productInput.sourceType) {
      //expects StepProduct
      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === productInput.sourceId;
        });
        if(referencedStep) {
          if(!referencedStep.isEmpty) {
            if(referencedStep.products) {
              //get ingredientsToRemove
              step.ingredientsToRemove = getIngredientsToRemove(step, referencedStep);
              //set up products
              step.products = getRemoveStepProducts(step, referencedStep);
            } else {
              //error: then no products for step
              ErrorService.logError({
                message: "Remove Step Service Error: no products for referenced step in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } else {
            //then referenced step contains nothing for this step
            step.isEmpty = true;
          }
        } else {
          //error: then no step found
          ErrorService.logError({
            message: "Remove Step Service Error: no products for referenced step in function 'instantiateStep'",
            referencedStep: referencedStep,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;
      default:
        //error unexpected sourceType
        ErrorService.logError({
          message: "Remove Step Service Error: unexpected sourceType in function 'instantiateStep'",
          input: productInput,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    if(step.ingredientsToRemove.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set stepTips - only using ingredientsToRemove
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToRemove);
    }
  }

  function constructStepText(step) {
    //[removeType] the [removeIngredients] from the [removeDish]
    if(!step.isEmpty) {
      var removeType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === 'removeType';
      }).val;
      var stepText = removeType + " ";
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToRemove);
      GeneralTextService.assignIngredientDisplayNames(step.ingredientsToRemove);
      switch(step.ingredientsToRemove.length) {
        case 0:
          //error
          ErrorService.logError({
            message: "Remove Step Service error: ingredientsToRemove in function 'constructStepText' are empty",
            step: step
          });
          ErrorService.showErrorAlert();
          break;
        case 1:
          stepText += step.ingredientsToRemove[0].prefix + " " + step.ingredientsToRemove[0].displayName.toLowerCase();
          break;
        case 2: 
          stepText += step.ingredientsToRemove[0].prefix + " " + step.ingredientsToRemove[0].displayName.toLowerCase() + " and " +step.ingredientsToRemove[1].prefix + " " + step.ingredientsToRemove[1].displayName.toLowerCase();
          break;
        default:
          for (var i = step.ingredientsToRemove.length - 1; i >= 0; i--) {
            if(i === 0) {
              stepText += "and " + step.ingredientsToRemove[i].prefix + " " + step.ingredientsToRemove[i].displayName.toLowerCase();
            } else {
              stepText += step.ingredientsToRemove[i].prefix + " " + step.ingredientsToRemove[i].displayName.toLowerCase() + ", ";
            }
          }
          break;
      }
      stepText += " from the " + step.dishRemovedFrom.name.toLowerCase();
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
