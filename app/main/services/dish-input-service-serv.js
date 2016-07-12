'use strict';
angular.module('main')
.factory('DishInputService', ['_', function (_) {
  var service = {};

  service.getDishKey = function(stepType) {
    switch(stepType) {
      case "Bake":
        return "productInput";
      case "Boil":
      case "BringToBoil":
      case "Cook":
      case "Heat":
      case "Sautee":
      case "Season":
      case "Steam":
        return "dishInput";
      case "Custom":
      case "EquipmentPrep":
        return "dishInputs";
      case "Place":
        return "dishProductInput";
      default:
        //error
        console.log("DishInputService error: unexpected stepType: ", stepType);
        break;
    }
  }

  service.findDishProduct = function(step, stepList, equipmentList) {
    var dishKey = service.getDishKey(step.stepType);
    var dishInput = step.stepInputs[dishKey];
    if(step.isEmpty) {
      step.isEmptyLink = true;
    }
    switch(dishInput.sourceType) {
      case "EquipmentList":
        console.log("step ---- equipmentList: ", step);
        var dish = _.find(equipmentList, function(dish) {
          return dish.name === dishInput.key;
        });
        if(dish) {
          return {
            dishes: [dish],
            ingredients: []
          };
        } else {
          //error
          console.log("DishInputService error: no dish found on equipmentList from input: ", dishInput);
        }
      case "StepProduct":
        var prevStep = _.find(stepList, function(iterStep) {
          return iterStep.stepId === dishInput.sourceId;
        });
        if(prevStep) {
          if(prevStep.isEmpty) {
            return service.findDishProduct(prevStep, stepList, equipmentList);
          } else {
            if(prevStep.products) {
              return prevStep.products[dishInput.key];
            } else {
              //error
              console.log("DishInputService error: no products for previous step: ", prevStep);
            }
          }
        } else {
          //error - cannot find prevStep
          console.log("DishInputService error: cannot find previous step from input: ", dishInput);
        }
      default:
        //error
        console.log("DishInputService error: unexpected sourceType: ", dishInput);
        break;
    }
  };

  return service;
}]);
