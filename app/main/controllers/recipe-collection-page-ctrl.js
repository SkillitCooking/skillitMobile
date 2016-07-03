'use strict';
angular.module('main')
.controller('RecipeCollectionPageCtrl', ['$scope', '$stateParams', '$state', 'RecipeService', function ($scope, $stateParams, $state, RecipeService) {

  $scope.collection = $stateParams.collection;

  $scope.recipeIconClass = function(index) {
    if($scope.recipes[index].isSelected) {
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.recipeSelected = function(recipe) {
    recipe.isSelected = true;
    setTimeout(function() {
      recipe.isSelected = false;
    }, 400);
    setTimeout(function() {
      $state.go('main.cookPresent', {recipeIds: [recipe._id], selectedIngredientNames: [], alaCarteRecipes: [], alaCarteSelectedArr: [], loadAlaCarte: true});
    }, 200);
  };

  RecipeService.getRecipesForCollection($scope.collection._id).then(function(recipes) {
    $scope.recipes = recipes.data;
    if($scope.recipes) {
      for (var i = $scope.recipes.length - 1; i >= 0; i--) {
        $scope.recipes[i].prepTime = 5 * Math.round($scope.recipes[i].prepTime/5);
        $scope.recipes[i].totalTime = 5 * Math.round($scope.recipes[i].totalTime/5);
      }
    }
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
