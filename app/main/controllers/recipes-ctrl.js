'use strict';
angular.module('main')
.controller('RecipesCtrl', ['$scope', '$ionicHistory', '$ionicNavBarDelegate', '$state', 'RecipeService', 'ItemCollectionService', '$ionicLoading', function ($scope, $ionicHistory, $ionicNavBarDelegate, $state, RecipeService, ItemCollectionService, $ionicLoading) {

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.loadedArr = Array(2).fill(false);
  
  ItemCollectionService.getCollectionsForItemType('recipe').then(function(collections) {
    $scope.recipeCollections = collections.data;
    $scope.loadedArr[0] = true;
    if($scope.loadedArr[0] && $scope.loadedArr[1]) {
      $ionicLoading.hide();
    }
  }, function(response) {
    console.log("Server Error: ", response);
  });

  RecipeService.getRecipesOfType('BYO').then(function(recipes) {
    $scope.BYORecipes = recipes.data;
    if($scope.BYORecipes) {
      for (var i = $scope.BYORecipes.length - 1; i >= 0; i--) {
        $scope.BYORecipes[i].prepTime = 5 * Math.round($scope.BYORecipes[i].prepTime/5);
        $scope.BYORecipes[i].totalTime = 5 * Math.round($scope.BYORecipes[i].totalTime/5);
      }
    }
    $scope.loadedArr[1] = true;
    if($scope.loadedArr[0] && $scope.loadedArr[1]) {
      $ionicLoading.hide();
    }
  }, function(response) {
    console.log("Server Error: ", response);
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.$on('$ionicView.enter', function(event, data) {
    $ionicNavBarDelegate.showBackButton(false);
  });

  $scope.fullSelected = true;
  $scope.BYOSelected = false;

  $scope.getFullButtonClass = function() {
    if(!$scope.fullSelected){
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.selectFull = function() {
    $scope.fullSelected = true;
    $scope.BYOSelected = false;
  };

  $scope.getBYOButtonClass = function() {
    if(!$scope.BYOSelected){
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.selectBYO = function() {
    $scope.BYOSelected = true;
    $scope.fullSelected = false;
  };

  $scope.BYORecipeClass = function(index) {
    if($scope.BYORecipes[index].isSelected) {
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.recipeSelected = function(recipe) {
    recipe.isSelected = true;
    //go to selectIngredients page
    setTimeout(function() {
      recipe.isSelected = false;
    }, 400);
    var ingredientTypes = recipe.ingredientList.ingredientTypes;
    for (var i = ingredientTypes.length - 1; i >= 0; i--) {
      if(ingredientTypes[i].minNeeded == ingredientTypes[i].ingredients.length) {
        for (var j = ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
          ingredientTypes[i].ingredients[j].useInRecipe = true;
        }
      }
    }
    setTimeout(function() {
      $state.go('main.editBYOIngredientsRecipes', {
        alaCarteRecipes: [],
        alaCarteSelectedArr: [],
        previousRecipeIds: [recipe._id],
        selectedIngredientNames: [],
        BYOIngredientTypes: ingredientTypes,
        BYOName: recipe.name,
        loadAlaCarte: true
      }, 200);
    });
  };
}]);
