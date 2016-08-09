'use strict';
angular.module('main')
.factory('bakeStepService', ['_', 'stirStepService', 'StepTipService', 'ErrorService',
  function (_, stirStepService, StepTipService, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    for(var inputName in step.stepInputs){
      var input = step.stepInputs[inputName];
      //expects StepProduct, all other inputs generate error
      switch(input.sourceType) {
        case "StepProduct":
          //find referenced step via sourceId
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === input.sourceId;
          });
          if(referencedStep){
            if(!referencedStep.isEmpty) {
              if(referencedStep.products){
                //then get ingredients and dish
                step.ingredientsToBake = referencedStep.products[input.key].ingredients;
                step.bakingDish = referencedStep.products[input.key].dishes[0];
                //will possibly want to make more general in the future
                step.products = {};
                step.products[step.productKeys[0]] = {
                  ingredients: step.ingredientsToBake,
                  dishes: [step.bakingDish]
                };
                step.isEmpty = false;
              } else {
                //then no products for referencedStep, throw error
                ErrorService.logError({
                  message: "Baking Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            } else {
              //then referenced step contains nothing for this step
              step.isEmpty = true;
            }
          } else {
            //then step couldn't be found, throw error
            ErrorService.logError({
              message: "Baking Step Service ERROR: step via sourceId couldn't be located in function 'instantiateStep'",
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        default:
          ErrorService.logError({
            message: "Baking Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
            sourceType: input.sourceType,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
          break;
      }
    }
    //fill in step tip related information
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, step.ingredientsToBake);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var bakingTime = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "bakingTime";
      }).val;
      var stepText = "Bake the ";
      switch(step.ingredientsToBake.length){
        case 0:
          //error case - we obviously expect ingredients to bake
          ErrorService.logError({
            message: "Baking Step Service ERROR: no ingredients to bake in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += step.ingredientsToBake[0].name[step.ingredientsToBake[0].nameFormFlag].toLowerCase() + " " + bakingTime;
          break;

        case 2:
          stepText += step.ingredientsToBake[0].name[step.ingredientsToBake[0].nameFormFlag].toLowerCase() + " and " + step.ingredientsToBake[1].name[step.ingredientsToBake[1].nameFormFlag].toLowerCase() + " " + bakingTime;
          break;

        default:
          for (var i = step.ingredientsToBake.length - 1; i >= 0; i--) {
            if(i === 0){
              stepText += "and " + step.ingredientsToBake[i].name[step.ingredientsToBake[i].nameFormFlag].toLowerCase() +
                " " + bakingTime;
            } else {
              stepText += step.ingredientsToBake[i].name[step.ingredientsToBake[i].nameFormFlag].toLowerCase() + ", ";
            }
          }
          break;
      }
      step.text = stepText;
    }
  }

  function constructAuxiliarySteps(step, recipe) {
    //need to get associated ingredientType for each auxStep,
    //then send its ingredients to the stirStep service
    if(!step.isEmpty) {
      for (var i = step.auxiliarySteps.length - 1; i >= 0; i--) {
        var auxStep = step.auxiliarySteps[i];
        var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
          return type.typeName === auxStep.ingredientTypeName;
        });
        var auxStepIngredients;
        if(recipe.recipeType === 'BYO') {
          auxStepIngredients = _.filter(ingredientType.ingredients, function(ingredient) {
            return ingredient.useInRecipe;
          });
        } else {
          auxStepIngredients = ingredientType.ingredients;
        }
        stirStepService.constructAuxiliaryStep(auxStep, auxStepIngredients);
      }
    }
  }

  service.fillInStep = function(recipe, stepIndex) {
    var step = recipe.stepList[stepIndex];
    //instantiate step
    instantiateStep(step, recipe);
    //construct step text
    constructStepText(step);
    //construct auxiliary steps
    if(step.auxiliarySteps && step.auxiliarySteps.length > 0){
      constructAuxiliarySteps(step, recipe);
    }
  };

  return service;
}]);
