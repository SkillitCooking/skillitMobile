'use strict';
angular.module('main')
.controller('CookRecipeSelectionCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', 'RecipeService', '_', '$ionicLoading', '$ionicPopup', '$ionicPlatform', 'ErrorService', function ($scope, $stateParams, $state, $ionicHistory, RecipeService, _, $ionicLoading, $ionicPopup, $ionicPlatform, ErrorService) {
  $scope.selectedIngredients = $stateParams.selectedIngredients;
  $scope.selectedIngredientNames = [];
  $scope.selectedIngredientIds = [];
  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    var navigateBack = true;
    if($scope.resetPopup && $scope.resetPopup.pending) {
      $scope.resetPopup.pending = false;
      navigateBack = false;
      $scope.resetPopup.close();
    }
    if(navigateBack) {
      $scope.navigateBack();
    }
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  function recipeCategoryCmpFn(a, b) {
    if(a.recipeCategory < b.recipeCategory) {
      return -1;
    }
    if(a.recipeCategory > b.recipeCategory) {
      return 1;
    }
    return 0;
  }

  function ingredientCategoryCmpFn(a, b) {
    if(a.ingredientList.ingredientTypes[0].ingredients[0].inputCategory < b.ingredientList.ingredientTypes[0].ingredients[0].inputCategory) {
      return -1;
    } else if(a.ingredientList.ingredientTypes[0].ingredients[0].inputCategory > b.ingredientList.ingredientTypes[0].ingredients[0].inputCategory) {
      return 1;
    } else {
      //then same category, sort by ingredient
      //assuming only one ingredientType and one ingredient for that ingredientType
      //for all alaCarteRecipes
      if(a.ingredientList.ingredientTypes[0].ingredients[0].name.standardForm < b.ingredientList.ingredientTypes[0].ingredients[0].name.standardForm) {
        return -1;
      } else if(a.ingredientList.ingredientTypes[0].ingredients[0].name.standardForm > b.ingredientList.ingredientTypes[0].ingredients[0].name.standardForm) {
        return 1;
      } else {
        //then same ingredient
        return 0;
      }
    }
  }

  _.forEach($scope.selectedIngredients, function(ingredient) {
    $scope.selectedIngredientNames.push(ingredient.name.standardForm);
    $scope.selectedIngredientIds.push({
      _id: ingredient._id,
      formIds: _.map(ingredient.ingredientForms, '_id') 
    });
  });
  var ingredientIds = {
    ingredientIds: $scope.selectedIngredientIds
  };
  RecipeService.getRecipesWithIngredients(ingredientIds).then(function(response) {
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
      $scope.fullRecipes.sort(recipeCategoryCmpFn);
    }
    $scope.BYORecipes = response.data.BYO;
    if($scope.BYORecipes) {
      for (var i = $scope.BYORecipes.length - 1; i >= 0; i--) {   
        $scope.BYORecipes[i].prepTime = 5 * Math.round($scope.BYORecipes[i].prepTime/5);
        $scope.BYORecipes[i].totalTime = 5 * Math.round($scope.BYORecipes[i].totalTime/5);
      }
    }
    if($scope.noFullDishes()) {
      $scope.fullSelected = false;
      if($scope.noBYODishes()) {
        $scope.alaCarteSelected = true;
        if($scope.noAlaCarteDishes()) {
          //error - there should be at least one recipe available for some selection
          //of ingredients
          ErrorService.logError({
            message: "Cook Recipe Selection Controller ERROR: no recipes found for selected Ingredients",
            ingredients: ingredientIds
          });
          ErrorService.showErrorAlert();
        }
      } else {
        $scope.BYOSelected = true;
      }
    }
    setTimeout(function() {
      $ionicLoading.hide();
    }, 300);
  }, function(response){
    ErrorService.showErrorAlert();
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
  $scope.currentFullHeader = "";

  $scope.needsHeader = function(recipe) {
    //if recipe has different header from alaCarteHeader
    if(recipe.recipeType === 'AlaCarte') {
      if(recipe.ingredientList.ingredientTypes[0].ingredients[0].inputCategory !== $scope.currentAlaCarteHeader) {
        $scope.currentAlaCarteHeader = recipe.ingredientList.ingredientTypes[0].ingredients[0].inputCategory;
        return true;
      } else {
        return false;
      }
    } else if(recipe.recipeType === 'Full') {
      if(recipe.recipeCategory !== $scope.currentFullHeader) {
        $scope.currentFullHeader = recipe.recipeCategory;
        return true;
      } else {
        return false;
      }
    }
  };

  $scope.getHeader = function(recipe) {
    if(recipe.recipeType === 'AlaCarte') {
      return recipe.ingredientList.ingredientTypes[0].ingredients[0].inputCategory;
    } else if(recipe.recipeType === 'Full') {
      return recipe.recipeCategory;
    }
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

  $scope.getRecipeActiveTime = function(recipe) {
    if(recipe.manActiveTime && recipe.manActiveTime !== "") {
      return recipe.manActiveTime;
    } else {
      return recipe.prepTime;
    }
  };

  $scope.getRecipeTotalTime = function(recipe) {
    if(recipe.manTotalTime && recipe.manTotalTime !== "") {
      return recipe.manTotalTime;
    } else {
      return recipe.totalTime;
    }
  };

  $scope.fullRecipeClass = function(index) {
    if($scope.fullRecipes[index].isSelected) {
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.BYORecipeClass = function(index) {
    if($scope.BYORecipes[index].isSelected) {
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
    $scope.resetPopup = $ionicPopup.confirm({
      title: 'Reset Everything?',
      template: 'Do you want to start over with new ingredients?',
      cssClass: ''
    });
    $scope.resetPopup.pending = true;
    $scope.resetPopup.then(function(res) {
      $scope.resetPopup.pending = false;
      if(res) {
        $ionicHistory.clearCache().then(function() {
          $state.go('main.cook');
        }, function(error) {
          //error
          ErrorService.logError({
            message: "Cook Recipe Selection Controller ERROR: failed to clear $ionicHistory cache",
            error: error
          });
          ErrorService.showErrorAlert();
        });
      }
    });
  };

  function addMissingIngredients(recipe) {
    var newNames = _.map(recipe.missingIngredients, function(ingred) {
      return ingred.nameObj.standardForm;
    });
    var newIds = _.map(recipe.missingIngredients, function(ingred) {
      return {
        _id: ingred._id, 
        formIds: ingred.formIds
      };
    });
    $scope.selectedIngredientNames = $scope.selectedIngredientNames.concat(newNames);
    $scope.selectedIngredientIds = $scope.selectedIngredientIds.concat(newIds);
  }

  $scope.recipeSelected = function(recipe) {
    //"pull up" present-recipe page using first one selected
    recipe.isSelected = true;
    if(recipe.missingIngredients && recipe.missingIngredients.length !== 0) {
      addMissingIngredients(recipe);
    }
    var recipeIds = [recipe._id];
    if($scope.alaCarteClickedArr) {
      for (var i = $scope.alaCarteClickedArr.length - 1; i >= 0; i--) {
        if($scope.alaCarteClickedArr[i]) {
          recipeIds.push($scope.alaCarteRecipes[i]._id);
        }
      }
    } else {
      $scope.alaCarteClickedArr = [];
    }
    setTimeout(function() {
      recipe.isSelected = false;
    }, 400);
    setTimeout(function() {
      $state.go('main.cookPresent', {recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteClickedArr});
    }, 200);
  };

  $scope.cookAlaCarte = function() {
    //provisional: "pull up" present-recipe page using first one selected
    var recipeIds = [];
    for (var i = $scope.alaCarteClickedArr.length - 1; i >= 0; i--) {
      if($scope.alaCarteClickedArr[i]){
        recipeIds.push($scope.alaCarteRecipes[i]._id);
      }
    }
    $state.go('main.cookPresent', {recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteClickedArr});
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
