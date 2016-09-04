'use strict';
angular.module('main')
.factory('cutStepService', ['_', 'StepTipService', 'GeneralTextService', 'ErrorService', 'NAME_FORM_FLAGS', 'STEP_TYPES', 'CUT_STEP_NAMES', function (_, StepTipService, GeneralTextService, ErrorService, NAME_FORM_FLAGS, STEP_TYPES, CUT_STEP_NAMES) {
  var service = {};

  function getTransformationPrefix(step) {
    var actionType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "actionType";
      }).val;
    switch(actionType) {
      case CUT_STEP_NAMES.CUT:
        return CUT_STEP_NAMES.CUT;
      case CUT_STEP_NAMES.DICE:
        return CUT_STEP_NAMES.DICED;
      case CUT_STEP_NAMES.CHOP:
        return CUT_STEP_NAMES.CHOPPED;
      case CUT_STEP_NAMES.MINCE:
        return CUT_STEP_NAMES.MINCED;
      case CUT_STEP_NAMES.SLICE:
        return CUT_STEP_NAMES.SLICED;
      default:
        ErrorService.logError({
            message: "Cut Step Service ERROR: unrecognized actionType in function 'getTransformationPrefix'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
        ErrorService.showErrorAlert();
        break;
    }
  }

  function instantiateStep(step, recipe) {
    //only expect cutIngredientInput
    var input = step.stepInputs["cutIngredientInput"];
    //expects either StepProduct or IngredientList
    switch(input.sourceType) {
      case "IngredientList":
        var ingredientType = _.find(recipe.ingredientList.ingredientTypes, function(type) {
          return type.typeName === input.key;
        });
        if(ingredientType){
          if(ingredientType.ingredients.length > 0) {
            var concatIngredients;
            if(recipe.recipeType !== 'BYO') {
              concatIngredients = ingredientType.ingredients;
            } else {
              concatIngredients = _.filter(ingredientType.ingredients, function(ingredient){
                return ingredient.useInRecipe;
              });
            }
            //adjust concatIngredients nameFormFlag here
            //want standard during, plural after
            step.ingredientsToCut = concatIngredients;
            step.products = {};
            var productIngredients = angular.copy(step.ingredientsToCut);
            step.products[step.productKeys[0]] = {
              ingredients: _.forEach(productIngredients, function(ingredient) {
                  ingredient.nameFormFlag = NAME_FORM_FLAGS.PLURAL;
                  ingredient.transformationPrefix = getTransformationPrefix(step);
                  ingredient.hasBeenUsed = true;
              }),
              dishes: [],
              sourceStepType: STEP_TYPES.CUT
            };
            step.recipeCategory = recipe.recipeCategory;
          } 
        } else {
          //error
          ErrorService.logError({
            message: "Cut Step Service ERROR: no ingredientType found for input key in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      case "StepProduct":
        var referencedStep = _.find(recipe.stepList, function(iterStep) {
          return iterStep.stepId === input.sourceId;
        });
        if(referencedStep){
          if(!referencedStep.isEmpty) {
            if(referencedStep.products){
              step.ingredientsToCut = referencedStep.products[input.key].ingredients;
              var productIngredients = _.forEach(angular.copy(step.ingredientsToCut), function(ingredient) {
                  ingredient.nameFormFlag = NAME_FORM_FLAGS.PLURAL;
                  ingredient.transformationPrefix = getTransformationPrefix(step);
                  ingredient.hasBeenUsed = true;
              });
              step.products = {};
              step.products[step.productKeys[0]] = {
                ingredients: productIngredients,
                dishes: [],
                sourceStepType: STEP_TYPES.CUT
              };
              step.recipeCategory = recipe.recipeCategory;
            } else {
              //then no products for referencedStep, throw error
              console.log("cutStepService Error: no proudcts for referencedStep: ", referencedStep);
              ErrorService.logError({
                message: "Cut Step Service ERROR: no products for referencedStep in function 'instantiateStep'",
                referencedStep: referencedStep,
                step: step,
                recipeName: recipe.name
              });
              ErrorService.showErrorAlert();
            }
          } 
        } else {
          //can't find step - Error
          ErrorService.logError({
            message: "Cut Step Service ERROR: cannot find step referenced by input in function 'instantiateStep'",
            input: input,
            step: step,
            recipeName: recipe.name
          });
          ErrorService.showErrorAlert();
        }
        break;

      default:
        //error for unexpected sourceType
        console.log("cutStepService Error: unexpected sourceType: ", input);
        ErrorService.logError({
          message: "Cut Step Service ERROR: unexpected sourceType in function 'instantiateStep'",
          input: input,
          step: step,
          recipeName: recipe.name
        });
        ErrorService.showErrorAlert();
        break;
    }
    //set isEmpty
    if(step.ingredientsToCut.length === 0) {
      step.isEmpty = true;
    } else {
      step.isEmpty = false;
    }
    //no "global" setting of a StepTip for CutStep, due to its textArr nature
  }

  function constructStepText(step) {
    if(!step.isEmpty) {
      step.textArr = [];
      var actionType = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "actionType";
      }).val;
      var actionModifier = _.find(step.stepSpecifics, function(specific) {
        return specific.propName === "actionModifier";
      }).val;
      GeneralTextService.assignIngredientPrefixes(step.ingredientsToCut);
      for (var i = step.ingredientsToCut.length - 1; i >= 0; i--) {
        var arrElem = {};
        if(!step.ingredientsToCut[i].nameFormFlag) {
          step.ingredientsToCut[i].nameFormFlag = NAME_FORM_FLAGS.STANDARD;
        }
        arrElem.recipeCategorys = [step.recipeCategory];
        arrElem.actionType = actionType;
        arrElem.ingredientName = step.ingredientsToCut[i].name[step.ingredientsToCut[i].nameFormFlag];
        arrElem.text = actionType;
        arrElem.text += " " + step.ingredientsToCut[i].prefix + " " + step.ingredientsToCut[i].name[step.ingredientsToCut[i].nameFormFlag].toLowerCase();
        if(actionModifier){
          arrElem.text += " " + actionModifier;
          arrElem.actionModifier = actionModifier;
        }
        StepTipService.setTipForTextArrElem(arrElem, step.ingredientsToCut[i], step);
        step.textArr.push(arrElem);
      }
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
