'use strict';
angular.module('main')
.controller('CookPresentCtrl', ['$scope', '$stateParams', 'RecipeService', 'RecipeInstantiationService', '$ionicPopover', function ($scope, $stateParams, RecipeService, RecipeInstantiationService, $ionicPopover) {

  function getCombinedRecipe(recipes) {
    //assign step numbers
    var combinedRecipe = recipes[0];
    var stepNumber = 1;
    if(combinedRecipe) {
      for (var i = 0; i < combinedRecipe.stepList.length; i++) {
        if(combinedRecipe.stepList[i].textArr) {
          for (var j = 0; j < combinedRecipe.stepList[i].textArr.length; j++) {
            combinedRecipe.stepList[i].textArr[j].stepNumber = stepNumber;
            stepNumber += 1;
          }
        } else {
          combinedRecipe.stepList[i].stepNumber = stepNumber;
          stepNumber += 1;
        }
      }
    }
    return combinedRecipe;
  }

  $scope.recipeIds = $stateParams.recipeIds;
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  var wrappedRecipeIds = {
    recipeIds: $scope.recipeIds
  };
  RecipeService.getRecipesWithIds(wrappedRecipeIds).then(function(response) {
    var recipes = response.data;
    RecipeInstantiationService.cullIngredients(recipes, $scope.selectedIngredientNames);
    RecipeInstantiationService.fillInSteps(recipes);
    //build the below out later
    $scope.combinedRecipe = getCombinedRecipe(recipes);
    console.log("recipe: ", $scope.combinedRecipe);
  });

  $scope.isSingleStep = function(step) {
    if(step.text) {
      return true;
    } else if (step.textArr) {
      return false;
    } else {
      //error
      console.log("step has neither text nor textArr: ", step);
    }
  };

  //first have popup show both cases; then do automatic video play for video case
  $scope.showTip = function(step, event) {
    if(step.hasTip || step.hasVideo){
      console.log(step);
      $scope.stepTipStep = step;
      $scope.selectedTipArr = Array($scope.stepTipStep.stepTips.length).fill(false);
      $scope.selectedTipArr[0] = true;
      $scope.stepTipStep.stepTips.push({title: "fakeTitle"});
      $scope.displayStepTip = $scope.stepTipStep.stepTips[0];
      $ionicPopover.fromTemplateUrl('main/templates/step-tip-popover.html', 
        {scope: $scope}).then(function(popover) {
        $scope.popover = popover;
        $scope.popover.show(event);
      });
    }
  };

  $scope.selectStepTip = function(index) {
    $scope.selectedTipArr.fill(false);
    $scope.selectedTipArr[index] = true;
    $scope.displayStepTip = $scope.stepTipStep.stepTips[index];
    console.log($scope.displayStepTip);
  };

  $scope.getStepTipButtonClass = function(index) {
    if($scope.selectedTipArr[index]) {
      return "button button-royal";
    } else {
      return "button button-royal button-outline";
    }
  };

  $scope.tipHasText = function() {
    if($scope.displayStepTip.text && $scope.displayStepTip.text !== "") {
      return true;
    } else {
      return false;
    }
  };

  $scope.tipHasVideo = function() {
    if($scope.displayStepTip.videoURL && $scope.displayStepTip.videoURL !== "") {
      return true;
    } else {
       return false;
    }
  };
}]);
