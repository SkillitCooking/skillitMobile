'use strict';
angular.module('main')
.controller('CookRecipeSelectionCtrl', ['$scope', '$stateParams', '$state', 'RecipeService', '_', function ($scope, $stateParams, $state, RecipeService, _) {
  $scope.selectedIngredients = $stateParams.selectedIngredients;
  $scope.selectedIngredientNames = [];

  _.forEach($scope.selectedIngredients, function(ingredient) {
    $scope.selectedIngredientNames.push(ingredient.name);
  });
  var ingredientNames = {
    ingredientNames: $scope.selectedIngredientNames
  };
  RecipeService.getRecipesWithIngredients(ingredientNames).then(function(response) {
    $scope.alaCarteRecipes = response.data.AlaCarte;
    if($scope.alaCarteRecipes){
      $scope.alaCarteClickedArr = Array($scope.alaCarteRecipes.length).fill(false);
    }
    $scope.fullRecipes = response.data.Full;
    $scope.BYORecipes = response.data.BYO;
  }, function(response){
    console.log("Server Error: " + response.message);
  });

  $scope.alaCarteSelected = true;

  $scope.getAlaCarteButtonClass = function() {
    if($scope.alaCarteSelected){
      return "button button-energized";
    } else {
      return "button button-outline button-energized";
    }
  };

  $scope.getCompleteButtonClass = function() {
    if($scope.alaCarteSelected){
      return "button button-outline button-energized";
    } else {
      return "button button-energized";
    }
  };

  $scope.selectAlaCarte = function() {
    $scope.alaCarteSelected = true;
  };

  $scope.selectComplete = function() {
    $scope.alaCarteSelected = false;
  };

  $scope.alaCarteItemClicked = function(index){
    $scope.alaCarteClickedArr[index] = !$scope.alaCarteClickedArr[index];
  };

  $scope.alaCarteClass = function(index) {
    if($scope.alaCarteClickedArr[index]){
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.noneSelected = function() {
    return !_.some($scope.alaCarteClickedArr, function(entry) {
      return entry;
    });
  };

  $scope.recipeSelected = function(recipe) {
    //"pull up" present-recipe page using first one selected
    var recipeIds = [recipe._id];
    if($scope.alaCarteClickedArr) {
      for (var i = $scope.alaCarteClickedArr.length - 1; i >= 0; i--) {
        if($scope.alaCarteClickedArr[i]) {
          recipeIds.push($scope.alaCarteRecipes[i]._id);
        }
      }
    }
    console.log("selected in selectionctrl: ", $scope.selectedIngredientNames);
    $state.go('main.cookPresent', {recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames});
  };

  //TODO
  $scope.cookAlaCarte = function() {
    //provisional: "pull up" present-recipe page using first one selected
    var recipeIds = [];
    console.log("selected ala in selectionctrl: ", $scope.selectedIngredientNames);
    for (var i = $scope.alaCarteClickedArr.length - 1; i >= 0; i--) {
      if($scope.alaCarteClickedArr[i]){
        recipeIds.push($scope.alaCarteRecipes[i]._id);
      }
    }
    $state.go('main.cookPresent', {recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames});
  };
}]);
