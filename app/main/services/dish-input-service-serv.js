'use strict';
angular.module('main')
.factory('DishInputService', ['_', 'ErrorService', function (_, ErrorService) {
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
        ErrorService.logError({
          message: "DishInput Service ERROR: unexpected stepType in function 'getDishKey'",
          stepType: stepType
        });
        ErrorService.showErrorAlert();
        break;
    }
  };

  service.findDishProduct = function(step, stepList, equipmentList) {
    var dishKey = service.getDishKey(step.stepType);
    var dishInput = step.stepInputs[dishKey];
    if(step.isEmpty) {
      step.isEmptyLink = true;
    }
    switch(dishInput.sourceType) {
      case "EquipmentList":
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
          ErrorService.logError({
            message: "DishInput Service ERROR: no dish found on equipmentList in function 'findDishProduct'",
            dishInput: dishInput
          });
          ErrorService.showErrorAlert();
        }
        break;

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
              ErrorService.logError({
                message: "DishInput Service ERROR: no products for previous step in function 'findDishProduct'",
                prevStep: prevStep
              });
              ErrorService.showErrorAlert();
            }
          }
        } else {
          //error - cannot find prevStep
          ErrorService.logError({
            message: "DishInput Service ERROR: cannot find previous step from input in function 'findDishProduct'",
            dishInput: dishInput
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error
        ErrorService.logError({
          message: "DishInput Service ERROR: unexpected sourceType from input in function 'findDishProduct'",
          dishInput: dishInput
        });
        ErrorService.showErrorAlert();
        break;
    }
  };

  return service;
}]);
