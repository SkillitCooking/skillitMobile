'use strict';
angular.module('main')
.controller('AccountHomeCtrl', ['$scope', '$state', '$ionicLoading', '$ionicAuth', '$ionicUser', 'UserService', 'FavoriteRecipeService', 'ErrorService', 'USER', function ($scope, $state, $ionicLoading, $ionicAuth, $ionicUser, UserService, FavoriteRecipeService, ErrorService, USER) {

  $scope.ages = USER.AGES;
  $scope.accountInfoSelected = false;
  $scope.favRecipeSelected = true;
  $scope.favoriteRecipes = [];
  $scope.infoHasChanged = false;

  $scope.$on('signInStart', function(event) {
    event.preventDefault();
    $ionicLoading.show();
  });

  $scope.$on('newRecipeFavorited', function(event) {
    event.preventDefault();
    FavoriteRecipeService.getFavoriteRecipesForUser({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken()
      }).then(function(res) {
        $scope.favoriteRecipes = res.data;
      }, function(response) {
        ErrorService.showErrorAlert();
      });
  });

  $scope.$on('signInStop', function(event, removePopover, fetchRecipes) {
    event.preventDefault();
    if(fetchRecipes) {
      FavoriteRecipeService.getFavoriteRecipesForUser({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken()
      }).then(function(res) {
        $scope.favoriteRecipes = res.data;
        $ionicLoading.hide();
      }, function(response) {
        ErrorService.showErrorAlert();
      });
      UserService.getPersonalInfo({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken()
      }).then(function(res) {
        $scope.user = res.data;
      }, function(response) {
        ErrorService.showErrorAlert();
      });
    } else {
      $ionicLoading.hide();
    }
  });

//maybe wrap on some kind of $ionicView event?
  if($ionicAuth.isAuthenticated()) {
    FavoriteRecipeService.getFavoriteRecipesForUser({
      userId: $ionicUser.get(USER.ID),
      token: $ionicAuth.getToken()
    }).then(function(res) {
      $scope.favoriteRecipes = res.data;
    }, function(response) {
      ErrorService.showErrorAlert();
    });
    UserService.getPersonalInfo({
      userId: $ionicUser.get(USER.ID),
      token: $ionicAuth.getToken()
    }).then(function(res) {
      $scope.user = res.data;
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  }

  $scope.getFavRecipesButtonClass = function() {
    if(!$scope.favRecipeSelected) {
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.getAccountInfoButtonClass = function() {
    if(!$scope.accountInfoSelected) {
      return "button button-outline button-balanced";
    } else {
      return "button button-balanced";
    }
  };

  $scope.selectFavRecipes = function() {
    $scope.favRecipeSelected = true;
    $scope.accountInfoSelected = false;
  };

  $scope.selectAccountInfo = function() {
    $scope.accountInfoSelected = true;
    $scope.favRecipeSelected = false;
  };

  $scope.isAuthenticated = function() {
    return $ionicAuth.isAuthenticated();
  };

  $scope.changeUserInfo = function() {
    $scope.infoHasChanged = true;
  };

  $scope.noFavoriteRecipes = function() {
    return $scope.favoriteRecipes.length === 0;
  };

  $scope.saveUserInfo = function() {
    $ionicLoading.show();
    UserService.updatePersonalInfo({
      userId: $ionicUser.get(USER.ID),
      token: $ionicAuth.getToken(),
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName,
      age: $scope.user.age
    }).then(function(res) {
      $ionicLoading.hide();
      $scope.user = res.data;
      $scope.infoHasChanged = false;
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  };

  $scope.userInfoHasChanged = function() {
    return $scope.infoHasChanged;
  };

  $scope.cookFavoriteRecipe = function(recipe) {
    $state.go('main.cookPresentFavoriteRecipe', {
      recipeIds: recipe.recipeIds,
      selectedIngredientNames: recipe.ingredientNames,
      selectedIngredientIds: recipe.ingredientAndFormIds,
      alaCarteRecipes: [],
      alaCarteSelectedArr: []
    });
  };

  $scope.logout = function() {
    $ionicLoading.show();
    var userId = $ionicUser.get(USER.ID);
    var token = $ionicAuth.getToken();
    $ionicAuth.logout();
    UserService.logout({
      userId: userId,
      token: token
    }).then(function(res) {
      $ionicLoading.hide();
    }, function(response) {
      $ionicLoading.hide();
      ErrorService.showErrorAlert();
    });
  };
}]);
