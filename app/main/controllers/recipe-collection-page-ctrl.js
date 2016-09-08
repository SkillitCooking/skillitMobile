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

  function setSelected(names, ids, recipe) {
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredient = type.ingredients[j];
        names.push(ingredient.name.standardForm);
        var formIds = [];
        for (var k = ingredient.ingredientForms.length - 1; k >= 0; k--) {
          formIds.push(ingredient.ingredientForms[k]._id);
        }
        ids.push({
            _id: ingredient._id,
            formIds: formIds
          });
      }
    }
  }

  //BYO handling here too
  $scope.recipeSelected = function(recipe) {
    recipe.isSelected = true;
    setTimeout(function() {
      recipe.isSelected = false;
    }, 400);
    if($scope.collection.isBYOCollection) {
      var ingredientTypes = recipe.ingredientList.ingredientTypes;
      for (var i = ingredientTypes.length - 1; i >= 0; i--) {
        for (var j = ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
          if(ingredientTypes[i].minNeeded == ingredientTypes[i].ingredients.length) {
            ingredientTypes[i].ingredients[j].useInRecipe = true;
          }
          //so we get a checked form, if forms are displayable, immediately when
          //an ingredient is selected on the editBYO screen
          ingredientTypes[i].ingredients[j].ingredientForms[0].useInRecipe = true;
        }
      }
      console.log('byo types: ', ingredientTypes);
      setTimeout(function() {
        $state.go('main.editBYOIngredientsRecipes', {
          alaCarteRecipes: [],
          alaCarteSelectedArr: [],
          previousRecipeIds: [recipe._id],
          selectedIngredientNames: [],
          selectedIngredientIds: [],
          BYOIngredientTypes: ingredientTypes,
          BYOName: recipe.name,
          loadAlaCarte: true
        }, 200);
      });
    } else {
      //set initial ingredients and names
      var selectedNames = [], selectedIds = [];
      setSelected(selectedNames, selectedIds, recipe);
      setTimeout(function() {
        $state.go('main.cookPresentRecipes', {recipeIds: [recipe._id], selectedIngredientNames: selectedNames, selectedIngredientIds: selectedIds, alaCarteRecipes: [], alaCarteSelectedArr: [], cameFromRecipes: false, cameFromRecipeCollection: true});
      }, 200);
    }
  };

  //BYO handling here
  if($scope.collection && $scope.collection.isBYOCollection){
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
    if($scope.collection) {
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
  }
}]);
