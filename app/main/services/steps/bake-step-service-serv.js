'use strict';
angular.module('main')
.factory('bakeStepService', ['_', 'stirStepService', 'StepTipService', 
  function (_, stirStepService, StepTipService) {
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
            } else {
              //then no products for referencedStep, throw error
              console.log("Baking step service Error: no products for referencedStep", referencedStep);
            }
          } else {
            //then step couldn't be found, throw error
            console.log("Baking step service Error: step via sourceId couldn't be located");
          }
          break;

        default:
          console.log("Baking step service Error: unexpected sourceType: ", input.sourceType);
          break;
      }
    }
    //fill in step tip related information
    StepTipService.setStepTipInfo(step, step.ingredientsToBake);
  }

  function constructStepText(step) {
    var bakingTime = _.find(step.stepSpecifics, function(specific) {
      return specific.propName === "bakingTime";
    }).val;
    var stepText = "Bake the ";
    switch(step.ingredientsToBake.length){
      case 0:
        //error case - we obviously expect ingredients to bake
        stepText = "NO INGREDIENTS TO BAKE...";
        console.log("Baking step service Error: constructing step text, and didn't find any ingredients to bake");
        break;

      case 1:
        stepText += step.ingredientsToBake[0].name + bakingTime;
        break;

      case 2:
        stepText += step.ingredientsToBake[0].name + " and " + step.ingredientsToBake[1].name + bakingTime;
        break;

      default:
        for (var i = step.ingredientsToBake.length - 1; i >= 0; i--) {
          if(i === 0){
            stepText += "and " + step.ingredientsToBake[i].name +
              bakingTime;
          } else {
            stepText += step.ingredientsToBake[i].name + ", ";
          }
        }
        break;
    }
    step.text = stepText;
  }

  function constructAuxiliarySteps(step, recipe) {
    //need to get associated ingredientType for each auxStep,
    //then send its ingredients to the stirStep service
    for (var i = step.auxiliarySteps.length - 1; i >= 0; i--) {
      var auxStep = step.auxiliarySteps[i];
      console.log("auxStep: ", auxStep);
      var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
        return type.typeName === auxStep.ingredientTypeName;
      });
      console.log("ingredientType: ", ingredientType);
      stirStepService.constructAuxiliaryStep(auxStep, ingredientType.ingredients);
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
