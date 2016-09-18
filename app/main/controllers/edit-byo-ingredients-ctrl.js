'use strict';
angular.module('main')
.controller('EditByoIngredientsCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '_', '$ionicTabsDelegate', '$ionicPlatform', 'INGREDIENT_CATEGORIES', 'ErrorService', function ($scope, $stateParams, $state, $ionicHistory, _, $ionicTabsDelegate, $ionicPlatform, INGREDIENT_CATEGORIES, ErrorService) {

  $scope.hasChanged = false;
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  $scope.selectedIngredientIds = $stateParams.selectedIngredientIds;
  $scope.BYOIngredientTypes = $stateParams.BYOIngredientTypes;
  $scope.originalBYOIngredientTypes = angular.copy($scope.BYOIngredientTypes);
  $scope.BYOName = $stateParams.BYOName;
  $scope.loadAlaCarte = $stateParams.loadAlaCarte;

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $scope.navigateBack();
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  //on entering, if no selectedIngredientIds, then select first form of each ingredient
  //if selectedIngredientIds, then forms already going through?

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
      if(minNeeded < type.ingredients.length) {
        return false;
      }
      return count === minNeeded;
    } else {
      return false;
    }
  };

  $scope.canHaveForms = function(ingredient) {
    //if more than one, if ingredient useInRecipe, if proper inputCategory
    if((ingredient.ingredientForms && ingredient.ingredientForms.length > 1) && ingredient.useInRecipe) {
      switch(ingredient.inputCategory) {
        case INGREDIENT_CATEGORIES.VEGETABLES:
        case INGREDIENT_CATEGORIES.STARCH:
        case INGREDIENT_CATEGORIES.OTHER:
          return false;
        case INGREDIENT_CATEGORIES.PROTEIN:
          if(ingredient.name.standardForm === 'Chicken') {
            return false;
          }
          return true;
        default:
          ErrorService.logError({ 
            message: "Cook Controller ERROR: unexpected inputCategory in function 'canHaveForms'",
            inputCategory: ingredient.inputCategory 
          });
          ErrorService.showErrorAlert();
          break;
      }
    }
  };

  $scope.curDisplayName = "";

  $scope.isNewDisplayName = function(type) {
    if($scope.BYOIngredientTypes.length === 1) {
      return true;
    }
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
        _.pull($scope.selectedIngredientNames, type.ingredients[j].name.standardForm);
        //pull by ingredientId
        _.remove($scope.selectedIngredientIds, function(ingredId) {
          return type.ingredients[j]._id === ingredId._id;
        });
        if(type.ingredients[j].useInRecipe) {
          $scope.selectedIngredientNames.push(type.ingredients[j].name.standardForm);
          //push ingredientId and formIds with useInRecipe true
          var formIds = _.reduce(type.ingredients[j].ingredientForms, function(result, form) {
            if(form.useInRecipe) {
              result.push(form._id);
            }
            return result;
          }, []);
          $scope.selectedIngredientIds.push({
            _id: type.ingredients[j]._id,
            formIds: formIds
          });
        }
      }
    }
    if($stateParams.cameFromRecipes) {
      $state.go('main.cookPresentRecipes', {recipeIds: $stateParams.previousRecipeIds, selectedIngredientNames:$scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $stateParams.alaCarteRecipes, alaCarteSelectedArr: $stateParams.alaCarteSelectedArr, currentSeasoningProfile: $stateParams.currentSeasoningProfile, ingredientsChanged: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, loadAlaCarte: $scope.loadAlaCarte});
    } else {
      $state.go('main.cookPresent', {recipeIds: $stateParams.previousRecipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $stateParams.alaCarteRecipes, alaCarteSelectedArr: $stateParams.alaCarteSelectedArr, currentSeasoningProfile: $stateParams.currentSeasoningProfile, ingredientsChanged: true, numberBackToRecipeSelection: $stateParams.numberBackToRecipeSelection, cameFromRecipes: $stateParams.cameFromRecipes});
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
        var noForms = false;
        for (var i = types.length - 1; i >= 0; i--) {
          var typeMinNeeded = parseInt(types[i].minNeeded, 10);
          if(typeMinNeeded > minNeeded) {
            minNeeded = typeMinNeeded;
          }
          for (var j = types[i].ingredients.length - 1; j >= 0; j--) {
            if(types[i].ingredients[j].useInRecipe) {
              ingredientCount += 1;
              //check ingredientForm presence
              noForms = true;
              for (var k = types[i].ingredients[j].ingredientForms.length - 1; k >= 0; k--) {
                if(types[i].ingredients[j].ingredientForms[k].useInRecipe) {
                  noForms = false;
                }
              }
              if(noForms) {
                break;
              }
            }
          }
          if(noForms) {
            break;
          }
        }
        if(noForms) {
          retVal = true;
        } else {
          retVal = ingredientCount < minNeeded;
        }
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
          } else {
            //check for form change
            for (var k = curType.ingredients[j].ingredientForms.length - 1; k >= 0; k--) {
              //change in ingredientForms should only be relevant if the ingredient is selected...
              //prevents unwanted situation where orignally not selected ingredient gets selected, then 
              //forms changed, then gets unselected again
              if(curType.useInRecipe && (curType.ingredients[j].ingredientForms[k].useInRecipe !== origType.ingredients[j].ingredientForms[k].useInRecipe)) {
                $scope.hasChanged = true;
                return true;
              }
            }
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
          for (var k = curType.ingredients[j].ingredientForms.length - 1; k >= 0; k--) {
            curType.ingredients[j].ingredientForms[k].useInRecipe = origType.ingredients[j].ingredientForms[k].useInRecipe;
          }
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
          for (var k = curType.ingredients[j].ingredientForms.length - 1; k >= 0; k--) {
            curType.ingredients[j].ingredientForms[k].useInRecipe = origType.ingredients[j].ingredientForms[k].useInRecipe;
          }
        }
      }
    }
    $ionicHistory.goBack();
  };
}]);
