'use strict';
angular.module('main')
.controller('CookRecipeSelectionCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', 'RecipeService', '_', '$ionicNavBarDelegate', function ($scope, $stateParams, $state, $ionicHistory, RecipeService, _, $ionicNavBarDelegate) {
  $scope.selectedIngredients = $stateParams.selectedIngredients;
  $scope.selectedIngredientNames = [];

  function ingredientCategoryCmpFn(a, b) {
    if(a.ingredientList.ingredientTypes[0].ingredients[0].inputCategory < b.ingredientList.ingredientTypes[0].ingredients[0].inputCategory) {
      return -1;
    } else if(a.ingredientList.ingredientTypes[0].ingredients[0].inputCategory > b.ingredientList.ingredientTypes[0].ingredients[0].inputCategory) {
      return 1;
    } else {
      //then same category, sort by ingredient
      //assuming only one ingredientType and one ingredient for that ingredientType
      //for all alaCarteRecipes
      if(a.ingredientList.ingredientTypes[0].ingredients[0].name < b.ingredientList.ingredientTypes[0].ingredients[0].name) {
        return -1;
      } else if(a.ingredientList.ingredientTypes[0].ingredients[0].name > b.ingredientList.ingredientTypes[0].ingredients[0].name) {
        return 1;
      } else {
        //then same ingredient
        return 0;
      }
    }
  }

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
  });

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
      for (var i = $scope.alaCarteRecipes.length - 1; i >= 0; i--) {
        $scope.alaCarteRecipes[i].prepTime = 5 * Math.round($scope.alaCarteRecipes[i].prepTime/5);
        $scope.alaCarteRecipes[i].totalTime = 5 * Math.round($scope.alaCarteRecipes[i].totalTime/5);
      }
      //sort alaCarteRecipes according to ingredientCategory, then by ingredient
      $scope.alaCarteRecipes.sort(ingredientCategoryCmpFn);
    }
    $scope.fullRecipes = response.data.Full;
    if($scope.fullRecipes) {
      for (var i = $scope.fullRecipes.length - 1; i >= 0; i--) {   
        $scope.fullRecipes[i].prepTime = 5 * Math.round($scope.fullRecipes[i].prepTime/5);
        $scope.fullRecipes[i].totalTime = 5 * Math.round($scope.fullRecipes[i].totalTime/5);
      }
    }
    $scope.BYORecipes = response.data.BYO;
    if($scope.BYORecipes) {
      for (var i = $scope.BYORecipes.length - 1; i >= 0; i--) {   
        $scope.BYORecipes[i].prepTime = 5 * Math.round($scope.BYORecipes[i].prepTime/5);
        $scope.BYORecipes[i].totalTime = 5 * Math.round($scope.BYORecipes[i].totalTime/5);
      }
      $scope.BYORecipes.sort(ingredientCategoryCmpFn);
    }
    if($scope.noFullDishes()) {
      $scope.fullSelected = false;
      if($scope.noBYODishes()) {
        $scope.alaCarteSelected = true;
        if($scope.noAlaCarteDishes()) {
          //error - there should be at least one recipe available for some selection
          //of ingredients
          console.log("CookRecipeSelectionCtrl Error: no recipes");
        }
      } else {
        $scope.BYOSelected = true;
      }
    }
  }, function(response){
    console.log("Server Error: " + response.message);
  });

  $scope.noFullDishes = function() {
    if(!$scope.fullRecipes || $scope.fullRecipes.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  $scope.noAlaCarteDishes = function() {
    if(!$scope.alaCarteRecipes || $scope.alaCarteRecipes.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  $scope.noBYODishes = function() {
    if(!$scope.BYORecipes || $scope.BYORecipes.length === 0) {
      return true;
    } else {
      return false;
    }
  };


  $scope.alaCarteSelected = false;
  $scope.fullSelected = true;
  $scope.BYOSelected = false;
  
  $scope.currentAlaCarteHeader = "";

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

  $scope.getAlaCarteButtonClass = function() {
    if($scope.alaCarteSelected){
      return "button button-balanced";
    } else {
      return "button button-outline button-balanced";
    }
  };

  $scope.getFullButtonClass = function() {
    if(!$scope.fullSelected){
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.getBYOButtonClass = function() {
    if(!$scope.BYOSelected){
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.selectAlaCarte = function() {
    $scope.alaCarteSelected = true;
    $scope.BYOSelected = false;
    $scope.fullSelected = false;
  };

  $scope.selectBYO = function() {
    $scope.BYOSelected = true;
    $scope.fullSelected = false;
    $scope.alaCarteSelected = false;
  };

  $scope.selectFull = function() {
    $scope.alaCarteSelected = false;
    $scope.BYOSelected = false;
    $scope.fullSelected = true;
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

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.resetEverything = function() {
    $ionicHistory.clearCache().then(function() {
      $state.go('main.cook');
    }, function() {
      //error
      console.log('error: failure to clear $ionicHistory clearCache');
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
    $state.go('main.cookPresent', {recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteClickedArr});
  };

  $scope.cookAlaCarte = function() {
    //provisional: "pull up" present-recipe page using first one selected
    var recipeIds = [];
    for (var i = $scope.alaCarteClickedArr.length - 1; i >= 0; i--) {
      if($scope.alaCarteClickedArr[i]){
        recipeIds.push($scope.alaCarteRecipes[i]._id);
      }
    }
    $state.go('main.cookPresent', {recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteClickedArr});
  };

  $scope.swipeRight = function() {
    $ionicHistory.goBack();
  };

  $scope.swipeLeft = function() {
    for (var i = $scope.alaCarteClickedArr.length - 1; i >= 0; i--) {
      if($scope.alaCarteClickedArr[i]) {
        $scope.cookAlaCarte();
        break;
      }
    }
  };
}]);
