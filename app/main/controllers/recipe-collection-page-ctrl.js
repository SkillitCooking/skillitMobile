'use strict';
angular.module('main')
.controller('RecipeCollectionPageCtrl', ['$window', '$scope', '$stateParams', '$state', 'RecipeService', 'RecipeNameConstructionService', '$ionicLoading', '$ionicPlatform', '$ionicHistory', '$ionicUser', '$ionicAuth', 'ErrorService', 'USER', 'LOGIN', 'LOADING', function ($window, $scope, $stateParams, $state, RecipeService, RecipeNameConstructionService, $ionicLoading, $ionicPlatform, $ionicHistory, $ionicUser, $ionicAuth, ErrorService, USER, LOGIN, LOADING) {

  $scope.collection = $stateParams.collection;
  console.log('colleciton', $scope.collection);

  $ionicLoading.show({
    template: LOADING.FETCHING_TEMPLATE,
    noBackdrop: true
  });

  if(typeof $window.ga !== 'undefined') {
    $window.ga.trackView('RecipeCollection');
  }

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    $scope.navigateBack();
  }, 501);

  $scope.$on('picture.loaded', function(e) {
    $scope.newLoadedCount += 1;
    e.stopPropagation();
    if($scope.newLoadedCount >= $scope.newLoadedLength) {
      setTimeout(function() {
        $ionicLoading.hide();
      }, LOADING.TIMEOUT);
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  $scope.recipeIconClass = function(index) {
    if($scope.recipes[index].isSelected) {
      return "ion-checkmark-circled";
    } else {
      return "ion-ios-circle-outline";
    }
  };

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  //initialize first next page value
  $scope.nextPageNumber = 0;

  var userId, userToken;

  if($ionicAuth.isAuthenticated()) {
    userId = $ionicUser.get(USER.ID);
    userToken = $ionicAuth.getToken();
  }

  $scope.loadMoreRecipes = function() {
    if($scope.collection) {
      $scope.newLoadedCount = 0;
      RecipeService.getRecipesForCollection($scope.collection._id, $scope.nextPageNumber, userId, userToken).then(function(recipes) {
        if(recipes.data) {
          $scope.newLoadedLength = recipes.data.length;
          if(recipes.data.length !== 0) {
            for (var i = recipes.data.length - 1; i >= 0; i--) {
              recipes.data[i].prepTime = 5 * Math.round(recipes.data[i].prepTime/5);
              recipes.data[i].totalTime = 5 * Math.round(recipes.data[i].totalTime/5);
              RecipeNameConstructionService.setPrefixedRecipeName(recipes.data[i]);
            }
          }
          $scope.hideInfiniteScroll = !recipes.hasMoreToLoad;
        }
        if(!$scope.recipes) {
          $scope.recipes = [];
        }
        Array.prototype.push.apply($scope.recipes, recipes.data);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function(response) {
        ErrorService.showErrorAlert();
      });
      $scope.nextPageNumber += 1;
    }
  };

  function setSelected(names, ids, recipe) {
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredient = type.ingredients[j];
        names.push(ingredient.name.standardForm);
        var formIds = [];
        for (var k = ingredient.ingredientForms.length - 1; k >= 0; k--) {
          formIds.push(ingredient.ingredientForms[k]._id);
        }
        ids.push({
            _id: ingredient._id,
            formIds: formIds
          });
      }
    }
  }

  //BYO handling here too
  $scope.recipeSelected = function(recipe) {
    var displayName = recipe.displayName;
    var displayNameType = recipe.displayNameType;
    recipe.isSelected = true;
    setTimeout(function() {
      recipe.isSelected = false;
    }, 400);
    if($scope.collection.isBYOCollection) {
      var ingredientTypes = recipe.ingredientList.ingredientTypes;
      for (var i = ingredientTypes.length - 1; i >= 0; i--) {
        for (var j = ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
          if(ingredientTypes[i].minNeeded == ingredientTypes[i].ingredients.length) {
            ingredientTypes[i].ingredients[j].useInRecipe = true;
          }
          //so we get a checked form, if forms are displayable, immediately when
          //an ingredient is selected on the editBYO screen
          ingredientTypes[i].ingredients[j].ingredientForms[0].useInRecipe = true;
        }
      }
      setTimeout(function() {
        $state.go('main.editBYOIngredientsRecipes', {
          alaCarteRecipes: [],
          alaCarteSelectedArr: [],
          previousRecipeIds: [recipe._id],
          selectedIngredientNames: [],
          selectedIngredientIds: [],
          BYOIngredientTypes: ingredientTypes,
          BYOName: recipe.name,
          loadAlaCarte: true,
          isNewLoad: true
        }, 200);
      });
    } else {
      //set initial ingredients and names
      var selectedNames = [], selectedIds = [];
      setSelected(selectedNames, selectedIds, recipe);
      setTimeout(function() {
        $state.go('main.cookPresentRecipes', {recipeIds: [recipe._id], selectedIngredientNames: selectedNames, selectedIngredientIds: selectedIds, alaCarteRecipes: [], alaCarteSelectedArr: [], cameFromRecipes: false, cameFromRecipeCollection: true, isNewLoad: true, displayName: displayName, displayNameType: displayNameType, nameDefaultSeasoning: recipe.newDefaultSeasoning, displayPictureURL: recipe.presentDisplayPictureURL});
      }, 200);
    }
  };

  $scope.recipes = [];
}]);
