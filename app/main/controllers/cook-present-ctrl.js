'use strict';
angular.module('main')
.controller('CookPresentCtrl', ['$scope', '$stateParams', 'RecipeService', 'RecipeInstantiationService', function ($scope, $stateParams, RecipeService, RecipeInstantiationService) {
  $scope.recipeIds = $stateParams.recipeIds;
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  var wrappedRecipeIds = {
    recipeIds: $scope.recipeIds
  };
  RecipeService.getRecipesWithIds(wrappedRecipeIds).then(function(response) {
    var recipes = response.data;
    RecipeInstantiationService.cullIngredients(recipes, $scope.selectedIngredientNames);
    RecipeInstantiationService.fillInSteps(recipes);
    console.log("Partially Instantiated Recipes: ", recipes);
  });
}]);
