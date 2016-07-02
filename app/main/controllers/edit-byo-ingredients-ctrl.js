'use strict';
angular.module('main')
.controller('EditByoIngredientsCtrl', ['$scope', '$stateParams', '$state', '$ionicNavBarDelegate', '$ionicHistory', '_', '$ionicTabsDelegate', function ($scope, $stateParams, $state, $ionicNavBarDelegate, $ionicHistory, _, $ionicTabsDelegate) {
  
  $scope.$on('$ionicView.enter', function(event, data) {
    $ionicNavBarDelegate.showBackButton(false);
  });

  console.log("params", $stateParams);
  $scope.hasChanged = false;
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  $scope.BYOIngredientTypes = $stateParams.BYOIngredientTypes;
  $scope.originalBYOIngredientTypes = angular.copy($scope.BYOIngredientTypes);
  $scope.BYOName = $stateParams.BYOName;

  $scope.isCheckboxDisabled = function(type) {
    if(type.minNeeded !== '0') {
      var count = 0;
      for (var i = type.ingredients.length - 1; i >= 0; i--) {
        if(type.ingredients[i].useInRecipe) {
          count++;
        }
      }
      return count <= type.minNeeded;
    } else {
      return false;
    }
  };

  $scope.curDisplayName = "";

  $scope.isNewDisplayName = function(type) {
    //switch curDisplayName
    if(type.displayName === $scope.curDisplayName) {
      return false;
    } else {
      $scope.curDisplayName = type.displayName;
      return true;
    }
  };

  $scope.changeIngredients = function() {
    //adjust selected names - probably a little overly simplistic method
    for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
      var type = $scope.BYOIngredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        _.pull($scope.selectedIngredientNames, type.ingredients[j].name);
        if(type.ingredients[j].useInRecipe) {
          $scope.selectedIngredientNames.push(type.ingredients[j].name);
        }
      }
    }
    $state.go('main.cookPresent', {recipeIds: $stateParams.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, alaCarteRecipes: $stateParams.alaCarteRecipes, alaCarteSelectedArr: $stateParams.alaCarteSelectedArr, currentSeasoningProfile: $stateParams.currentSeasoningProfile, ingredientsChanged: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, cameFromRecipes: $stateParams.cameFromRecipes});
  };

  $scope.selectionHasChanged = function() {
    for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
      var curType = $scope.BYOIngredientTypes[i];
      var origType = $scope.originalBYOIngredientTypes[i];
      for (var j = curType.ingredients.length - 1; j >= 0; j--) {
        if(curType.ingredients[j].useInRecipe !== origType.ingredients[j].useInRecipe) {
          $scope.hasChanged = true;
          return true;
        }
      }
    }
    $scope.hasChanged = false;
    return false;
  };

  $scope.cancel = function() {
    if($stateParams.cameFromRecipes) {
      $ionicTabsDelegate.select(2);
    }
    if($scope.hasChanged) {
      for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
        var curType = $scope.BYOIngredientTypes[i];
        var origType = $scope.originalBYOIngredientTypes[i];
        for (var j = curType.ingredients.length - 1; j >= 0; j--) {
          curType.ingredients[j].useInRecipe = origType.ingredients[j].useInRecipe;
        }
      }
    }
    $ionicHistory.goBack();
  };

  $scope.getCancelText = function() {
    if($scope.hasChanged) {
      return 'Cancel';
    } else {
      return 'No Changes';
    }
  };

  $scope.navigateBack = function() {
    if($stateParams.cameFromRecipes) {
      $ionicTabsDelegate.select(2);
    }
    if($scope.hasChanged) {
      for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
        var curType = $scope.BYOIngredientTypes[i];
        var origType = $scope.originalBYOIngredientTypes[i];
        for (var j = curType.ingredients.length - 1; j >= 0; j--) {
          curType.ingredients[j].useInRecipe = origType.ingredients[j].useInRecipe;
        }
      }
    }
    $ionicHistory.goBack();
  };
}]);
