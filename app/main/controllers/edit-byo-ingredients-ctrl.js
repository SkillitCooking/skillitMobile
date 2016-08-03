'use strict';
angular.module('main')
.controller('EditByoIngredientsCtrl', ['$scope', '$stateParams', '$state', '$ionicNavBarDelegate', '$ionicHistory', '_', '$ionicTabsDelegate', function ($scope, $stateParams, $state, $ionicNavBarDelegate, $ionicHistory, _, $ionicTabsDelegate) {
  
  $scope.$on('$ionicView.enter', function(event, data) {
    $ionicNavBarDelegate.showBackButton(false);
  });

  $scope.hasChanged = false;
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  $scope.BYOIngredientTypes = $stateParams.BYOIngredientTypes;
  $scope.originalBYOIngredientTypes = angular.copy($scope.BYOIngredientTypes);
  $scope.BYOName = $stateParams.BYOName;
  $scope.loadAlaCarte = $stateParams.loadAlaCarte;

  $scope.partOfDisplayGroup = function(type) {
    var count = 0;
    for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
      if($scope.BYOIngredientTypes[i].displayName === type.displayName) {
        count++;
      }
    }
    if(count > 1) {
      return true;
    } else {
      return false;
    }
  };

  $scope.isCheckboxDisabled = function(type) {
    var minNeeded = parseInt(type.minNeeded, 10);
    if(minNeeded !== 0 && !$scope.partOfDisplayGroup(type)) {
      var count = 0;
      for (var i = type.ingredients.length - 1; i >= 0; i--) {
        if(type.ingredients[i].useInRecipe) {
          count++;
        }
      }
      return count === minNeeded;
    } else {
      return false;
    }
  };

  $scope.curDisplayName = "";

  $scope.isNewDisplayName = function(type) {
    //switch curDisplayName
    if(type.displayName === $scope.curDisplayName) {
      return false;
    } else {
      $scope.curDisplayName = type.displayName;
      return true;
    }
  };

  $scope.changeIngredients = function() {
    //adjust selected names - probably a little overly simplistic method
    for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
      var type = $scope.BYOIngredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        _.pull($scope.selectedIngredientNames, type.ingredients[j].name);
        if(type.ingredients[j].useInRecipe) {
          $scope.selectedIngredientNames.push(type.ingredients[j].name);
        }
      }
    }
    if($stateParams.cameFromRecipes) {
      $state.go('main.cookPresentRecipes', {recipeIds: $stateParams.previousRecipeIds, selectedIngredientNames:$scope.selectedIngredientNames, alaCarteRecipes: $stateParams.alaCarteRecipes, alaCarteSelectedArr: $stateParams.alaCarteSelectedArr, currentSeasoningProfile: $stateParams.currentSeasoningProfile, ingredientsChanged: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, loadAlaCarte: $scope.loadAlaCarte});
    } else {
      $state.go('main.cookPresent', {recipeIds: $stateParams.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, alaCarteRecipes: $stateParams.alaCarteRecipes, alaCarteSelectedArr: $stateParams.alaCarteSelectedArr, currentSeasoningProfile: $stateParams.currentSeasoningProfile, ingredientsChanged: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, cameFromRecipes: $stateParams.cameFromRecipes});
    }
  };

  $scope.cameFromRecipes = function() {
    return $stateParams.cameFromRecipes;
  };

  $scope.inadequateIngredients = function(source) {
    //will need to groupby display names
    var groupedIngredientTypes = _.groupBy($scope.BYOIngredientTypes, function(type) {
      return type.displayName;
    });
    var retVal;
    _.forIn(groupedIngredientTypes, function(types, name) {
      //values will be arrays
      //for each, sum over selected
      //if non-zero, store value until final iteration, then check
      if(!retVal) {
        var minNeeded = 0;
        var ingredientCount = 0;
        for (var i = types.length - 1; i >= 0; i--) {
          var typeMinNeeded = parseInt(types[i].minNeeded, 10);
          if(typeMinNeeded > minNeeded) {
            minNeeded = typeMinNeeded;
          }
          for (var j = types[i].ingredients.length - 1; j >= 0; j--) {
            if(types[i].ingredients[j].useInRecipe) {
              ingredientCount += 1;
            }
          }
        }
        retVal = ingredientCount < minNeeded;
      }
    });
    return retVal;
  };

  $scope.selectionHasChanged = function(source) {
    if($scope.BYOIngredientTypes) {
      for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
        var curType = $scope.BYOIngredientTypes[i];
        var origType = $scope.originalBYOIngredientTypes[i];
        for (var j = curType.ingredients.length - 1; j >= 0; j--) {
          if(curType.ingredients[j].useInRecipe !== origType.ingredients[j].useInRecipe) {
            $scope.hasChanged = true;
            return true;
          }
        }
      }
    }
    $scope.hasChanged = false;
    return false;
  };

  $scope.cancel = function() {
    if($stateParams.cameFromRecipes) {
      //$ionicTabsDelegate.select(4);
      $ionicHistory.goBack();
    }
    if($scope.hasChanged) {
      for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
        var curType = $scope.BYOIngredientTypes[i];
        var origType = $scope.originalBYOIngredientTypes[i];
        for (var j = curType.ingredients.length - 1; j >= 0; j--) {
          curType.ingredients[j].useInRecipe = origType.ingredients[j].useInRecipe;
        }
      }
    }
    $ionicHistory.goBack();
  };

  $scope.getCancelText = function() {
    if($scope.hasChanged || $stateParams.cameFromRecipes) {
      return 'Cancel';
    } else {
      return 'No Changes';
    }
  };

  $scope.navigateBack = function() {
    if($stateParams.cameFromRecipes) {
      $ionicHistory.goBack();
    }
    if($scope.hasChanged) {
      for (var i = $scope.BYOIngredientTypes.length - 1; i >= 0; i--) {
        var curType = $scope.BYOIngredientTypes[i];
        var origType = $scope.originalBYOIngredientTypes[i];
        for (var j = curType.ingredients.length - 1; j >= 0; j--) {
          curType.ingredients[j].useInRecipe = origType.ingredients[j].useInRecipe;
        }
      }
    }
    $ionicHistory.goBack();
  };
}]);
