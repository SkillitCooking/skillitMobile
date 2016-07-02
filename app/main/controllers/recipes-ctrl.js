'use strict';
angular.module('main')
.controller('RecipesCtrl', ['$scope', '$ionicHistory', '$ionicNavBarDelegate', '$state', 'RecipeService', 'ItemCollectionService', function ($scope, $ionicHistory, $ionicNavBarDelegate, $state, RecipeService, ItemCollectionService) {
  
  ItemCollectionService.getCollectionsForItemType('recipe').then(function(collections) {
    $scope.recipeCollections = collections.data;
  }, function(response) {
    console.log("Server Error: ", response);
  });

  RecipeService.getRecipesOfType('BYO').then(function(recipes) {
    $scope.BYORecipes = recipes.data;
  }, function(response) {
    console.log("Server Error: ", response);
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.$on('$ionicView.enter', function(event, data) {
    $ionicNavBarDelegate.showBackButton(true);
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
      $state.go('main.editBYOIngredients', {
        alaCarteRecipes: [],
        alaCarteSelectedArr: [],
        previousRecipeIds: [recipe._id],
        selectedIngredientNames: [],
        numberBackToRecipeSelection: 1,
        BYOIngredientTypes: ingredientTypes,
        BYOName: recipe.name,
        cameFromRecipes: true
      }, 200);
    });
  };
}]);
