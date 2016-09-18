'use strict';
angular.module('main')
.controller('RecipesCtrl', ['$scope', '$ionicHistory', '$state', 'RecipeService', 'ItemCollectionService', '$ionicLoading', '$ionicPopup', '$ionicPlatform', 'ErrorService', 'EXIT_POPUP', function ($scope, $ionicHistory, $state, RecipeService, ItemCollectionService, $ionicLoading, $ionicPopup, $ionicPlatform, ErrorService, EXIT_POPUP) {

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    $ionicPopup.confirm({
      title: EXIT_POPUP.TITLE,
      text: EXIT_POPUP.TEXT
    }).then(function(res) {
      if(res) {
        ionic.Platform.exitApp();
      }
    });
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  $scope.loadedArr = Array(2).fill(false);
  
  ItemCollectionService.getCollectionsForItemType('recipe').then(function(collections) {
    $scope.recipeCollections = collections.data;
    $scope.recipeCollections.unshift({
      description: 'Feeling a little creative? Take a look at these recipes that let you choose the ingredients that you want to use.',
      name: 'Build Your Own',
      itemType: 'recipe',
      isBYOCollection: true
    });
    $ionicLoading.hide();
  }, function(response) {
    ErrorService.showErrorAlert();
  });

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.fullSelected = true;
  //$scope.BYOSelected = false;

  /*$scope.getFullButtonClass = function() {
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
  };*/
}]);
