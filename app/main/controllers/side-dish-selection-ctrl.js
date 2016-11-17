'use strict';
angular.module('main')
.controller('SideDishSelectionCtrl', ['_', '$scope', '$stateParams', '$state', '$ionicHistory', '$ionicPlatform', function (_, $scope, $stateParams, $state, $ionicHistory, $ionicPlatform) {

  $scope.hasChanged = false;
  $scope.alaCarteRecipes = $stateParams.alaCarteRecipes;
  $scope.previousRecipeIds = $stateParams.previousRecipeIds;
  $scope.currentSeasoningProfile = $stateParams.currentSeasoningProfile;
  $scope.alaCarteSelectedArr = $stateParams.alaCarteSelectedArr;
  $scope.originalSelectedArr = angular.copy($scope.alaCarteSelectedArr);
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  $scope.selectedIngredientIds = $stateParams.selectedIngredientIds;

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $scope.navigateBack();
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

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

  $scope.alaCarteItemClicked = function(index) {
    $scope.alaCarteSelectedArr[index] = !$scope.alaCarteSelectedArr[index];
  };

  $scope.alaCarteClass = function(index) {
    if($scope.alaCarteSelectedArr[index]){
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.getRecipeActiveTime = function(recipe) {
    if(recipe.manActiveTime && recipe.manActiveTime !== "") {
      return 5 * Math.round(recipe.manActiveTime/5);
    } else {
      return 5 * Math.round(recipe.prepTime/5);
    }
  };

  $scope.getRecipeTotalTime = function(recipe) {
    if(recipe.manTotalTime && recipe.manTotalTime !== "") {
      return 5 * Math.round(recipe.manTotalTime/5);
    } else {
      return 5 * Math.round(recipe.totalTime/5);
    }
  };

  $scope.selectionHasChanged = function() {
    if($scope.alaCarteSelectedArr) {
      for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
        if($scope.alaCarteSelectedArr[i] !== $scope.originalSelectedArr[i]) {
          $scope.hasChanged = true;
          return true;
        }
      }
    }
    $scope.hasChanged = false;
    return false;
  };

  function addNewIngredients(recipes) {
    for (var i = recipes.length - 1; i >= 0; i--) {
      var types = recipes[i].ingredientList.ingredientTypes;
      for (var j = types.length - 1; j >= 0; j--) {
        for (var k = types[j].ingredients.length - 1; k >= 0; k--) {
          $scope.selectedIngredientNames.push(types[j].ingredients[k].name.standardForm);
          $scope.selectedIngredientIds.push({
            _id: types[j].ingredients[k]._id,
            formIds: _.map(types[j].ingredients[k].ingredientForms, '_id')
          });
        }
      }
    }
    $scope.selectedIngredientNames = _.uniq($scope.selectedIngredientNames);
    $scope.selectedIngredientIds = _.uniqBy($scope.selectedIngredientIds, '_id');
  }

  $scope.addSides = function() {
    //so can add new main player in newly created view... this is hacky... should be
    //eventually refactor to just remove unnecessary cook present back views
    var videoPlayer = angular.element( document.querySelector( '#mainplayer' ) );
    videoPlayer.remove();
    
    var selectedRecipes = [];
    for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
      if($scope.alaCarteSelectedArr[i]) {
        $scope.previousRecipeIds.push($scope.alaCarteRecipes[i]._id);
        selectedRecipes.push($scope.alaCarteRecipes[i]);
      } else if($scope.originalSelectedArr[i]) {
        _.pull($scope.previousRecipeIds, $scope.alaCarteRecipes[i]._id);
      }
    }
    //make previous recipes unique
    $scope.previousRecipeIds = _.uniq($scope.previousRecipeIds);
    if($stateParams.cameFromHome) {
      $state.go('main.cookPresentHome', {recipeIds: $scope.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteSelectedArr, currentSeasoningProfile: $scope.currentSeasoningProfile, sidesAdded: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, loadAlaCarte: false});
    } else if($stateParams.isFavoriteRecipe) {
      addNewIngredients(selectedRecipes);
      $state.go('main.cookPresentFavoriteRecipe', {recipeIds: $scope.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteSelectedArr, currentSeasoningProfile: $scope.currentSeasoningProfile, sidesAdded: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, loadAlaCarte: false});
    } else if($stateParams.cameFromRecipes) {
      addNewIngredients(selectedRecipes);
      $state.go('main.cookPresentRecipes', {recipeIds: $scope.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteSelectedArr, currentSeasoningProfile: $scope.currentSeasoningProfile, sidesAdded: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, loadAlaCarte: false});
    } else if($stateParams.cameFromRecipeCollection) {
      addNewIngredients(selectedRecipes);
      $state.go('main.cookPresentRecipes', {recipeIds: $scope.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteSelectedArr, currentSeasoningProfile: $scope.currentSeasoningProfile, sidesAdded: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, loadAlaCarte: false, cameFromRecipes: false, cameFromRecipeCollection: true});
    } else {
      $state.go('main.cookPresent', {recipeIds: $scope.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteSelectedArr, currentSeasoningProfile: $scope.currentSeasoningProfile, sidesAdded: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, loadAlaCarte: false});
    }
  };

  $scope.getCancelText = function() {
    if($scope.hasChanged) {
      return 'Cancel';
    } else {
      return 'No Changes';
    }
  };

  $scope.cancel = function() {
    if($scope.hasChanged) {
      for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
        $scope.alaCarteSelectedArr[i] = $scope.originalSelectedArr[i];
      }
    }
    $ionicHistory.goBack();
  };

  $scope.navigateBack = function() {
    if($scope.hasChanged) {
      for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
        $scope.alaCarteSelectedArr[i] = $scope.originalSelectedArr[i];
      }
    }
    $ionicHistory.goBack();
  };

}]);
