'use strict';
angular.module('main')
.controller('HomeCtrl', ['$scope', '$ionicHistory', '$ionicNavBarDelegate', '$state', 'RecipeService', 'DailyTipService', function ($scope, $ionicHistory, $ionicNavBarDelegate, $state, RecipeService, DailyTipService) {

  DailyTipService.getTipsOfTheDay().then(function(tips) {
    $scope.tipsOfTheDay = tips.data;
    $scope.tipsOfTheDayIndex = 0;
    $scope.displayDailyTip = $scope.tipsOfTheDay[$scope.tipsOfTheDayIndex];
  }, function(response) {
    console.log("Server Error: " + response.message);
  });

  RecipeService.getRecipesOfTheDay().then(function (recipes) {
    $scope.recipesOfTheDay = recipes.data;
    $scope.recipeIndex = 0;
    $scope.displayRecipe = $scope.recipesOfTheDay[$scope.recipeIndex];
  }, function(response) {
    console.log("Server Error: " + response.message);
  });

  $scope.isRecipeSelected = false;

  $scope.getRecipeClass = function() {
    if(!$scope.isRecipeSelected) {
      return 'ion-ios-circle-outline';
    } else {
      return 'ion-checkmark-circled';
    }
  };

  $scope.recipeSelected = function() {
    $scope.isRecipeSelected = true;
    setTimeout(function () {
      $state.go('main.cookPresent', {
        recipeIds: [$scope.displayRecipe._id],
        alaCarteRecipes: [],
        alaCarteSelectedArr: [],
        cameFromHome: true
      }, 200);
    });
  };

  $scope.nextRecipe = function() {
    $scope.recipeIndex += 1;
    $scope.displayRecipe = $scope.recipesOfTheDay[$scope.recipeIndex];
  };

  $scope.prevRecipe = function() {
    $scope.recipeIndex -= 1;
    $scope.displayRecipe = $scope.recipesOfTheDay[$scope.recipeIndex];
  };

  $scope.noNextRecipes = function() {
    if(!$scope.recipesOfTheDay || ($scope.recipeIndex === $scope.recipesOfTheDay.length -1)) {
      return true;
    }
    return false;
  };

  $scope.noPrevRecipes = function() {
    if(!$scope.recipeIndex || $scope.recipeIndex === 0) {
      return true;
    }
    return false;
  };

  $scope.goToRecipes = function() {
    $state.go('main.recipes');
  };

  $scope.nextTip = function() {
    $scope.tipsOfTheDayIndex += 1;
    $scope.displayDailyTip = $scope.tipsOfTheDay[$scope.tipsOfTheDayIndex];
  };

  $scope.prevTip = function() {
    $scope.tipsOfTheDayIndex -= 1;
    $scope.displayDailyTip = $scope.tipsOfTheDay[$scope.tipsOfTheDayIndex];
  };

  $scope.noNextTips = function() {
    if(!$scope.tipsOfTheDay || ($scope.tipsOfTheDayIndex === $scope.tipsOfTheDay.length - 1)){
      return true;
    }
    return false;
  };

  $scope.noPrevTips = function() {
    if(!$scope.tipsOfTheDayIndex || $scope.tipsOfTheDayIndex === 0) {
      return true;
    }
    return false;
  };

  $scope.goToTips = function() {
    $state.go('main.tips', {cameFromHome: true});
  };

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.$on("$ionicView.enter", function(event, data) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.isRecipeSelected = false;
  });
}]);