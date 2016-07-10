'use strict';
angular.module('main')
.controller('HomeCtrl', ['$scope', '$ionicHistory', '$ionicNavBarDelegate', '$state', 'RecipeService', 'DailyTipService', '$ionicLoading', function ($scope, $ionicHistory, $ionicNavBarDelegate, $state, RecipeService, DailyTipService, $ionicLoading) {

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.isLoadedArr = Array(2).fill(false);


  DailyTipService.getTipsOfTheDay().then(function(tips) {
    $scope.tipsOfTheDay = tips.data;
    $scope.tipsOfTheDayIndex = 0;
    $scope.displayDailyTip = $scope.tipsOfTheDay[$scope.tipsOfTheDayIndex];
    $scope.isLoadedArr[0] = true;
    if($scope.isLoadedArr[0] && $scope.isLoadedArr[1]) {
      setTimeout(function() {
      $ionicLoading.hide();
    }, 400);
    }
  }, function(response) {
    console.log("Server Error: " + response.message);
  });

  RecipeService.getRecipesOfTheDay().then(function (recipes) {
    $scope.recipesOfTheDay = recipes.data;
    for (var i = $scope.recipesOfTheDay.length - 1; i >= 0; i--) {
      $scope.recipesOfTheDay[i].prepTime = 5 * Math.round($scope.recipesOfTheDay[i].prepTime/5);
      $scope.recipesOfTheDay[i].totalTime = 5 * Math.round($scope.recipesOfTheDay[i].totalTime/5);
    }
    $scope.recipeIndex = 0;
    $scope.displayRecipe = $scope.recipesOfTheDay[$scope.recipeIndex];
    $scope.isLoadedArr[1] = true;
    if($scope.isLoadedArr[0] && $scope.isLoadedArr[1]) {
      setTimeout(function() {
        $ionicLoading.hide();
      }, 400);
    }
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
      $state.go('main.cookPresentHome', {
        recipeIds: [$scope.displayRecipe._id],
        alaCarteRecipes: [],
        alaCarteSelectedArr: []
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

  $scope.goToCook = function() {
    $state.go('main.cook');
  };

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.$on("$ionicView.enter", function(event, data) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.isRecipeSelected = false;
  });
}]);