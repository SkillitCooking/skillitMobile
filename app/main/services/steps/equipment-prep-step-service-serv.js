'use strict';
angular.module('main')
.factory('equipmentPrepStepService', ['_', 'StepTipService', 'ErrorService', function (_, StepTipService, ErrorService) {
  var service = {};

  function instantiateStep(step, recipe) {
    var inputs = step.stepInputs["dishInputs"];
    step.dishesToPrep = [];
    for (var i = inputs.length - 1; i >= 0; i--) {
      switch(inputs[i].sourceType){
        //expect equipmentList and stepProduct
        case "EquipmentList":
          var dish = _.find(recipe.ingredientList.equipmentNeeded, function(dish) {
            return dish.name === inputs[i].key;
          });
          if(dish) {
            step.dishesToPrep.push(dish);
            if(!step.products){
              step.products = {};
            }
            step.products[step.productKeys[0]] = {
              ingredients: [],
              dishes: step.dishesToPrep
            };
          } else {
            //error: dish couldn't be found
            ErrorService.logError({
              message: "EquipmentPrep Step Service ERROR: could not find dish from input in function 'instantiateStep'",
              input: inputs[i],
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        case "StepProduct":
          var referencedStep = _.find(recipe.stepList, function(iterStep) {
            return iterStep.stepId === inputs[i].sourceId;
          });
          if(referencedStep) {
            if(!referencedStep.isEmpty) {
              if(referencedStep.products){
                step.dishesToPrep = step.dishesToPrep.concat(referencedStep.products[inputs[i].key].dishes);
                if(!step.products){
                  step.products = {};
                }
                step.products[step.productKeys[0]] = {
                  ingredients: [],
                  dishes: step.dishesToPrep
                };
              } else {
                //error: no products for step
                console.log("equipmentPrepStepService error: no products for referencedStep: ", referencedStep);
                ErrorService.logError({
                  message: "EquipmentPrep Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                  referencedStep: referencedStep,
                  step: step,
                  recipeName: recipe.name
                });
                ErrorService.showErrorAlert();
              }
            }
          } else {
            //error: could not find step
            console.log("equipmentPrepStepService error: could not find step from input: ", inputs[i]);
            ErrorService.logError({
              message: "EquipmentPrep Step Service ERROR: could not find step from input in function 'instantiateStep'",
              input: inputs[i],
              step: step,
              recipeName: recipe.name
            });
            ErrorService.showErrorAlert();
          }
          break;

        default:
          //error: unexpected sourceType
          console.log("equipmentPrepStepService error: unexpected sourceType for dishInputs: ", inputs[i]);
          ErrorService.logError({
            message: "EquipmentPrep Step Service ERROR: unexpected sourceType for dishInputs in function 'instantiateStep'",
            input: inputs[i],
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
      }
    }
    //isEmpty condition
    if(step.dishesToPrep.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //set stepTips
    if(!step.isEmpty) {
      StepTipService.setStepTipInfo(step, []);
    }
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      var prepActionType = _.find(step.stepSpecifics, function(specific){
        return specific.propName === "prepActionType";
      }).val;
      var prepModifier = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "prepModifier";
      }).val;
      var stepText = prepActionType;
      switch(step.dishesToPrep.length) {
        case 0:
          //throw error
          stepText = "NO DISHES TO PREP";
          console.log("equipmentPrepStepService error: no dishes to prep in step", step);
          ErrorService.logError({
            message: "EquipmentPrep Step Service ERROR: no dishes to prep in step in function 'constructStepText'",
            step: step
          });
          ErrorService.showErrorAlert();
          break;

        case 1:
          stepText += " a " + step.dishesToPrep[0].name.toLowerCase();
          break;

        default:
          var nameCounts = _.countBy(step.dishesToPrep, function(dish) {
            return dish.name;
          });
          var numNames = _.size(nameCounts);
          switch(numNames){
            case 0:
              //error
              ErrorService.logError({
                message: "EquipmentPrep Step Service ERROR: no nameCounts in function 'constructStepText'",
                step: step
              });
              ErrorService.showErrorAlert();
              break;

            case 1:
              var keys = _.keys(nameCounts);
              stepText += " " + nameCounts[keys[0]] + " " + keys[0].toLowerCase() + "s";
              break;

            case 2:
              var keys = _.keys(nameCounts);
              var countKey1;
              var nameKey1;
              var countKey2;
              var nameKey2;
              if(nameCounts[keys[0]] === 1){
                countKey1 = "a";
                nameKey1 = keys[0];
              } else {
                countKey1 = nameCounts[keys[0]];
                nameKey1 = keys[0] + "s";
              }
              if(nameCounts[keys[1]] == 1){
                countKey2 = "a";
                nameKey2 = keys[1];
              } else {
                countKey2 = nameCounts[keys[0]];
                nameKey2 = keys[1] + "s";
              }
              stepText += " " + countKey1 + " " + nameKey1.toLowerCase() + " and " +
                countKey2 + " " + nameKey2.toLowerCase();
              break;

              default:
                var count = 1;
                var countKey;
                var nameKey;
                for(var name in nameCounts) {
                  if(nameCounts[name] === 1){
                    countKey = "a";
                    nameKey = name;
                  } else {
                    countKey = nameCounts[name];
                    nameKey = name + "s";
                  }
                  if(count === numNames){
                    stepText += " and " + countKey + " " + nameKey.toLowerCase();
                  } else {
                    stepText += " " + countKey + " " + nameKey.toLowerCase() + ",";
                  }
                  count++;
                }
                break;
          }
          break;
      }
      if(prepModifier && prepModifier != "") {
        stepText += " with " + prepModifier;
      }
      step.text = stepText;
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
