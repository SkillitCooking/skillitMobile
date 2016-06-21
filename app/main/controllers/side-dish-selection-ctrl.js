'use strict';
angular.module('main')
.controller('SideDishSelectionCtrl', ['_', '$scope', '$stateParams', '$state', '$ionicHistory', function (_, $scope, $stateParams, $state, $ionicHistory) {

  $scope.hasChanged = false;
  $scope.alaCarteRecipes = $stateParams.alaCarteRecipes;
  $scope.previousRecipeIds = $stateParams.previousRecipeIds;
  $scope.currentSeasoningProfile = $stateParams.currentSeasoningProfile;
  $scope.alaCarteSelectedArr = $stateParams.alaCarteSelectedArr;
  $scope.originalSelectedArr = angular.copy($scope.alaCarteSelectedArr);
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;

  $scope.needsHeader = function(recipe) {
    //if recipe has different header from alaCarteHeader
    if(recipe.ingredientList.ingredientTypes[0].ingredients[0].inputCategory !== $scope.currentAlaCarteHeader) {
      $scope.currentAlaCarteHeader = recipe.ingredientList.ingredientTypes[0].ingredients[0].inputCategory;
      return true;
    } else {
      return false;
    }
  };

  $scope.getHeader = function(recipe) {
    return recipe.ingredientList.ingredientTypes[0].ingredients[0].inputCategory;
  };

  $scope.alaCarteItemClicked = function(index) {
    $scope.alaCarteSelectedArr[index] = !$scope.alaCarteSelectedArr[index];
  };

  $scope.alaCarteClass = function(index) {
    if($scope.alaCarteSelectedArr[index]){
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.selectionHasChanged = function() {
    for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
      if($scope.alaCarteSelectedArr[i] !== $scope.originalSelectedArr[i]) {
        $scope.hasChanged = true;
        return true;
      }
    }
    $scope.hasChanged = false;
    return false;
  };

  $scope.addSides = function() {
    for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
      if($scope.alaCarteSelectedArr[i]) {
        $scope.previousRecipeIds.push($scope.alaCarteRecipes[i]._id);
      } else if($scope.originalSelectedArr[i]) {
        _.pull($scope.previousRecipeIds, $scope.alaCarteRecipes[i]._id);
      }
    }
    $state.go('main.cookPresent', {recipeIds: $scope.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteSelectedArr, currentSeasoningProfile: $scope.currentSeasoningProfile, sidesAdded: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection});
  };

  $scope.cancel = function() {
    if($scope.hasChanged) {
      for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
        $scope.alaCarteSelectedArr[i] = $scope.originalSelectedArr[i];
      }
    }
    $ionicHistory.goBack();
  };

  $scope.navigateBack = function() {
    if($scope.hasChanged) {
      for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
        $scope.alaCarteSelectedArr[i] = $scope.originalSelectedArr[i];
      }
    }
    $ionicHistory.goBack();
  };

}]);
