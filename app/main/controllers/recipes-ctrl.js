'use strict';
angular.module('main')
.controller('RecipesCtrl', ['$window', '$scope', '$ionicHistory', '$state', 'RecipeService', 'ItemCollectionService', '$ionicUser', '$ionicAuth', '$ionicLoading', '$ionicPopup', '$ionicPlatform', 'ErrorService', 'EXIT_POPUP', 'USER', 'LOGIN', 'LOADING', function ($window, $scope, $ionicHistory, $state, RecipeService, ItemCollectionService, $ionicUser, $ionicAuth, $ionicLoading, $ionicPopup, $ionicPlatform, ErrorService, EXIT_POPUP, USER, LOGIN, LOADING) {

  var token;
  var loginType = $ionicUser.get(LOGIN.TYPE);
  if(loginType === LOGIN.FACEBOOK || loginType === LOGIN.GOOGLE) {
    token = $ionicUser.get(LOGIN.SOCIALTOKEN);
  } else {
    token = $ionicAuth.getToken();
  }

  $ionicLoading.show({
    template: LOADING.DEFAULT_TEMPLATE,
    noBackdrop: true
  });

  $scope.$on('allCollections.Loaded', function(e) {
    e.stopPropagation();
    setTimeout(function() {
      $ionicLoading.hide();
    }, LOADING.TIMEOUT);
  });

  if(typeof $window.ga !== 'undefined') {
    $window.ga.trackView('Recipes');
  }

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

  function recipeCollectionSortFn(collectionA, collectionB) {
    if(collectionA.orderPreference == -1) {
      return 1;
    }
    if(collectionB.orderPreference == -1) {
      return -1;
    }
    if(collectionA.orderPreference < collectionB.orderPreference) {
      return -1;
    }
    if(collectionA.orderPreference > collectionB.orderPreference) {
      return 1;
    }
    return 0;
  }

  var userId, userToken;
  if(token) {
    userId = $ionicUser.get(USER.ID);
    userToken = token;
  }

  ItemCollectionService.getCollectionsForItemType('recipe', userId, userToken).then(function(collections) {
    $scope.recipeCollections = collections.data;
    $scope.recipeCollections.sort(recipeCollectionSortFn);
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
