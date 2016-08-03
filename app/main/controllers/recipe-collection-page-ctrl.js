'use strict';
angular.module('main')
.controller('RecipeCollectionPageCtrl', ['$scope', '$stateParams', '$state', 'RecipeService', '$ionicLoading', '$ionicNavBarDelegate', '$ionicHistory', 'ErrorService', function ($scope, $stateParams, $state, RecipeService, $ionicLoading, $ionicNavBarDelegate, $ionicHistory, ErrorService) {

  $scope.collection = $stateParams.collection;

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
  });

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.recipeIconClass = function(index) {
    if($scope.recipes[index].isSelected) {
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  //BYO handling here too
  $scope.recipeSelected = function(recipe) {
    recipe.isSelected = true;
    setTimeout(function() {
      recipe.isSelected = false;
    }, 400);
    if($scope.collection.isBYOCollection) {
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
    } else {
      setTimeout(function() {
        $state.go('main.cookPresentRecipes', {recipeIds: [recipe._id], selectedIngredientNames: [], alaCarteRecipes: [], alaCarteSelectedArr: [], cameFromRecipes: false, cameFromRecipeCollection: true});
      }, 200);
    }
  };

  //BYO handling here
  if($scope.collection.isBYOCollection){
    RecipeService.getRecipesOfType('BYO').then(function(recipes) {
      $scope.recipes = recipes.data;
      if($scope.recipes) {
        for (var i = $scope.recipes.length - 1; i >= 0; i--) {
          $scope.recipes[i].prepTime = 5 * Math.round($scope.recipes[i].prepTime/5);
          $scope.recipes[i].totalTime = 5 * Math.round($scope.recipes[i].totalTime/5);
        }
      }
      setTimeout(function() {
        $ionicLoading.hide();
      }, 200);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  } else {
    RecipeService.getRecipesForCollection($scope.collection._id).then(function(recipes) {
      $scope.recipes = recipes.data;
      if($scope.recipes) {
        for (var i = $scope.recipes.length - 1; i >= 0; i--) {
          $scope.recipes[i].prepTime = 5 * Math.round($scope.recipes[i].prepTime/5);
          $scope.recipes[i].totalTime = 5 * Math.round($scope.recipes[i].totalTime/5);
        }
      }
      setTimeout(function() {
        $ionicLoading.hide();
      }, 200);
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  }
}]);
