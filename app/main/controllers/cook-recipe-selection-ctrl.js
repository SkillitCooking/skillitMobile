'use strict';
angular.module('main')
.controller('CookRecipeSelectionCtrl', ['$window', '$rootScope', '$scope', '$stateParams', '$state', '$ionicHistory', 'RecipeService', 'RecipeNameConstructionService', '_', '$ionicLoading', '$ionicPopup', '$ionicPlatform', '$ionicUser', '$ionicAuth', 'ErrorService', 'USER', 'LOGIN', 'LOADING', 'PAGINATION', function ($window, $rootScope, $scope, $stateParams, $state, $ionicHistory, RecipeService, RecipeNameConstructionService, _, $ionicLoading, $ionicPopup, $ionicPlatform, $ionicUser, $ionicAuth, ErrorService, USER, LOGIN, LOADING, PAGINATION) {

  var token;
  var loginType = $ionicUser.get(LOGIN.TYPE);
  if(loginType === LOGIN.FACEBOOK || loginType === LOGIN.GOOGLE) {
    token = $ionicUser.get(LOGIN.SOCIALTOKEN);
  } else {
    token = $ionicAuth.getToken();
  }

  $scope.selectedIngredients = $stateParams.selectedIngredients;
  $scope.selectedIngredientNames = [];
  $scope.selectedIngredientIds = [];
  $ionicLoading.show({
    template: LOADING.FETCHING_TEMPLATE,
    noBackdrop: true
  });

  $scope.$on('picture.loaded', function(e) {
    $scope.newLoadedCount += 1;
    e.stopPropagation();
    if($scope.newLoadedCount >= $scope.newLoadedLength) {
      setTimeout(function() {
        $ionicLoading.hide();
      }, LOADING.TIMEOUT);
    }
  });

  if(typeof $window.ga !== 'undefined') {
    $window.ga.trackView('RecipeSelection');
  }

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

  //intercept dietaryPreferencesChanged event
  var dietaryPreferencesChanged = false;
  $scope.$on('dietaryPreferencesChanged', function(event) {
    event.preventDefault();
    dietaryPreferencesChanged = true;
  });

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
    if(dietaryPreferencesChanged) {
      $rootScope.$broadcast('dietaryPreferencesChanged');
    }
  });

  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    $scope.selectionTabStart = Date.now();
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
  //copy so as to preserve original ingredients when attempting to LoadMore
  var ingredientIds = angular.copy($scope.selectedIngredientIds);

  var userId, userToken;

  if(token) {
    userId = $ionicUser.get(USER.ID);
    userToken = token;
  }

  $scope.hideInfiniteScroll = true;
  
  RecipeService.getRecipesWithIngredientsNew(ingredientIds, userId, userToken).then(function(response) {
    var retObj = response.data;
    $scope.fullRecipes = retObj.returnRecipes;
    $scope.newLoadedCount = 0;
    $scope.newLoadedLength = $scope.fullRecipes.length;
    $scope.currentRecipeIdIndex = retObj.currentIndex;
    $scope.orderedRecipeIds = retObj.orderedRecipeIds;
    if($scope.fullRecipes) {
      for (var i = $scope.fullRecipes.length - 1; i >= 0; i--) {
        $scope.fullRecipes[i].prepTime = 5 * Math.round($scope.fullRecipes[i].prepTime/5);
        $scope.fullRecipes[i].totalTime = 5 * Math.round($scope.fullRecipes[i].totalTime/5);
        RecipeNameConstructionService.setPrefixedRecipeName($scope.fullRecipes[i]);
      }
    }
    setTimeout(function() {
      if($scope.orderedRecipeIds.length > $scope.currentRecipeIdIndex) {
        $scope.hideInfiniteScroll = false;
      }
      $ionicLoading.hide();
    }, 300);
  }, function(response){
    ErrorService.showErrorAlert();
  });

  $scope.loadMoreRecipes = function() {
    if($scope.fullRecipes) {
      var nextIndex = $scope.currentRecipeIdIndex +  PAGINATION.RECIPES_PAGE_SIZE;
      var idsToFetch = $scope.orderedRecipeIds.slice($scope.currentRecipeIdIndex, nextIndex);
      RecipeService.getMoreRecipesForSelection(idsToFetch, ingredientIds).then(function(res) {
        var recipes = res.data;
        $scope.newLoadedCount = 0;
        $scope.newLoadedLength = recipes.length;
        $scope.currentRecipeIdIndex = nextIndex;
        if($scope.currentRecipeIdIndex >= $scope.orderedRecipeIds.length) {
          $scope.hideInfiniteScroll = true;
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          recipes[i].prepTime = 5 * Math.round(recipes[i].prepTime/5);
          recipes[i].totalTime = 5 * Math.round(recipes[i].totalTime/5);
          RecipeNameConstructionService.setPrefixedRecipeName(recipes[i]);
        }
        Array.prototype.push.apply($scope.fullRecipes, recipes);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function(response) {
        ErrorService.showErrorAlert();
      });
    }
  };

  $scope.noFullDishes = function() {
    if(!$scope.fullRecipes || Object.keys($scope.fullRecipes).length === 0) {
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
    }
  };

  $scope.getFullHeader = function(recipeCategory) {
    if(recipeCategory === 'Sautee') {
      return 'Stir Frys';
    }
    if(recipeCategory === 'Hash') {
      return 'Potato Hashes';
    }
    if(recipeCategory === 'Roast') {
      return 'One Pan Roasts';
    }
    if(recipeCategory === 'Rice') {
      return 'Fried Rice';
    }
    if(recipeCategory === 'Quinoa') {
      return 'Loaded Quinoa';
    }
    return recipeCategory;
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

  function getCurrentTabName() {
    if($scope.alaCarteSelected) {
      return 'AlaCarte';
    }
    if($scope.BYOSelected) {
      return 'BYO';
    }
    if($scope.fullSelected) {
      return 'Full';
    }
  }

  $scope.selectAlaCarte = function() {
    if(typeof $window.ga !== 'undefined') {
      var interval = Date.now() - $scope.selectionTabStart;
      $window.ga.trackTiming('RecipeSelection', interval, getCurrentTabName());
      $scope.selectionTabStart = Date.now();
    }
    $scope.alaCarteSelected = true;
    $scope.BYOSelected = false;
    $scope.fullSelected = false;
  };

  $scope.selectBYO = function() {
    if(typeof $window.ga !== 'undefined') {
      var interval = Date.now() - $scope.selectionTabStart;
      $window.ga.trackTiming('RecipeSelection', interval, getCurrentTabName());
      $scope.selectionTabStart = Date.now();
    }
    $scope.BYOSelected = true;
    $scope.fullSelected = false;
    $scope.alaCarteSelected = false;
  };

  $scope.selectFull = function() {
    if(typeof $window.ga !== 'undefined') {
      var interval = Date.now() - $scope.selectionTabStart;
      $window.ga.trackTiming('RecipeSelection', interval, getCurrentTabName());
      $scope.selectionTabStart = Date.now();
    }
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

  $scope.fullRecipeClass = function(index, recipeCategory) {
    if($scope.fullRecipes[recipeCategory].recipes[index].isSelected) {
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

  $scope.loadMoreRecipeCategories = function(recipeCategory) {
    //should we have a loading going on here?
    $ionicLoading.show({
      template: LOADING.TEMPLATE,
      noBackdrop: true
    });
    var recipeIds = $scope.fullRecipes[recipeCategory].additionalRecipeIds;
    RecipeService.getMoreRecipesForCategory({recipeIds: recipeIds}).then(function(res) {
      var recipes = res.data;
      for (var i = recipes.recipes.length - 1; i >= 0; i--) {
        RecipeNameConstructionService.setPrefixedRecipeName(recipes.recipes[i]);
      }
      Array.prototype.push.apply($scope.fullRecipes[recipeCategory].recipes, recipes.recipes);
      $scope.fullRecipes[recipeCategory].hasMoreToLoad = recipes.hasMoreToLoad;
      $scope.fullRecipes[recipeCategory].additionalRecipeIds = recipes.additionalRecipeIds;
      $ionicLoading.hide();
    }, function(response) {
      $ionicLoading.hide();
      ErrorService.showErrorAlert();
    });
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
      title: 'Reset Selection?',
      template: '<p class="no-ingredient-popup">Do you want to clear your ingredients and start over?</p>',
      cssClass: '',
      cancelText: 'No',
      okText: 'Yes'
    });
    $scope.resetPopup.pending = true;
    $scope.resetPopup.then(function(res) {
      $scope.resetPopup.pending = false;
      if(res) {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.selectionTabStart;
          $window.ga.trackTiming('RecipeSelection', interval, getCurrentTabName());
        }
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
    if(typeof $window.ga !== 'undefined') {
      var interval = Date.now() - $scope.selectionTabStart;
      $window.ga.trackTiming('RecipeSelection', interval, getCurrentTabName());
      $window.ga.trackEvent('NameConstruction.selected', recipe.setPrefix, recipe.name);
    }
    var displayName = recipe.displayName;
    var displayNameType = recipe.displayNameType;
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
      $state.go('main.cookPresent', {displayName: displayName, displayNameType: displayNameType, nameDefaultSeasoning: recipe.newDefaultSeasoning, recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteClickedArr, isNewLoad: true, loadAlaCarte: true});
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
    if(typeof $window.ga !== 'undefined') {
      var interval = Date.now() - $scope.selectionTabStart;
      $window.ga.trackTiming('RecipeSelection', interval, getCurrentTabName());
    }
    $state.go('main.cookPresent', {recipeIds: recipeIds, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, alaCarteRecipes: $scope.alaCarteRecipes, alaCarteSelectedArr: $scope.alaCarteClickedArr, isNewLoad: true});
  };

  $scope.swipeRight = function() {
    if(typeof $window.ga !== 'undefined') {
      var interval = Date.now() - $scope.selectionTabStart;
      $window.ga.trackTiming('RecipeSelection', interval, getCurrentTabName());
    }
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
