'use strict';
angular.module('main')
.controller('AccountHomeCtrl', ['_', '$rootScope', '$scope', '$state', '$ionicLoading', '$ionicAuth', '$ionicUser', '$ionicPopover', 'UserService', 'FavoriteRecipeService', 'DietaryPreferencesService', 'ErrorService', 'USER', function (_, $rootScope, $scope, $state, $ionicLoading, $ionicAuth, $ionicUser, $ionicPopover, UserService, FavoriteRecipeService, DietaryPreferencesService, ErrorService, USER) {

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
        DietaryPreferencesService.getAllDietaryPreferences().then(function(res) {
          $scope.dietaryPreferences = res.data;
          for (var i = $scope.dietaryPreferences.length - 1; i >= 0; i--) {
            if(_.some($scope.user.dietaryPreferences, function(userPref) {
              return userPref.title === $scope.dietaryPreferences[i].title;
            })) {
              $scope.dietaryPreferences[i].isMarked = true;
            }
          }
        }, function(response) {
          ErrorService.showErrorAlert();
        });
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
      DietaryPreferencesService.getAllDietaryPreferences().then(function(res) {
          console.log('res: ', res);
          $scope.dietaryPreferences = res.data;
          for (var i = $scope.dietaryPreferences.length - 1; i >= 0; i--) {
            if(_.some($scope.user.dietaryPreferences, function(userPref) {
              return userPref.title === $scope.dietaryPreferences[i].title;
            })) {
              $scope.dietaryPreferences[i].isMarked = true;
            }
          }
        }, function(response) {
          ErrorService.showErrorAlert();
        });
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

  $scope.getDietaryPreferencesString = function() {
    if($scope.dietaryPreferences) {
      console.log('dietaryPreferences', angular.copy($scope.dietaryPreferences));
      var amendedDietaryPreferences = _.filter($scope.dietaryPreferences, function(pref) {
        return pref.isMarked;
      });
      switch(amendedDietaryPreferences.length) {
        case 0:
          return 'No Restrictions';
        case 1: 
          return amendedDietaryPreferences[0].title;
        case 2:
          return amendedDietaryPreferences[0].title + " and " +amendedDietaryPreferences[1].title;
        default:
          var dietaryPreferences = '';
          for (var i = amendedDietaryPreferences.length - 1; i >= 0; i--) {
            if(i === 0) {
              dietaryPreferences += "and " + amendedDietaryPreferences[i].title;
            } else {
              dietaryPreferences += amendedDietaryPreferences[i].title + ", ";
            }
          }
          return dietaryPreferences;
      }
    }
  };

  $scope.editPreferences = function(event) {
    //instantiate popup (ala seasonings popup)
    //will need a dietaryPreferencesService to populate fields
    //checked off preferences will need to be cross referenced with user's
    //set to true $scope.userInfoHasChanged
    $ionicPopover.fromTemplateUrl('main/templates/dietary-preferences-popup.html', {scope: $scope}).then(function(popover) {
      $rootScope.redrawSlides = true;
      $scope.dietaryPreferencesPopup = popover;
      $scope.dietaryPreferencesPopup.show(event);
    });
  };

  $scope.$on('$destroy', function() {
    if($scope.dietaryPreferencesPopup) {
      $scope.dietaryPreferencesPopup.remove();
    }
  });

  $scope.closeDietaryPreferencesPopup = function() {
    if($scope.dietaryPreferencesPopup) {
      setTimeout(function() {$scope.dietaryPreferencesPopup.remove()}, 100);
    }
  };

  $scope.saveUserInfo = function() {
    //will need to do dietary preferences update here
    var dietaryPreferences = [];
    for (var i = $scope.dietaryPreferences.length - 1; i >= 0; i--) {
      if($scope.dietaryPreferences[i].isMarked) {
        dietaryPreferences.push($scope.dietaryPreferences[i]);
      }
    }
    $ionicLoading.show();
    UserService.updatePersonalInfo({
      userId: $ionicUser.get(USER.ID),
      token: $ionicAuth.getToken(),
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName,
      age: $scope.user.age,
      dietaryPreferences: dietaryPreferences
    }).then(function(res) {
      $ionicLoading.hide();
      $scope.user = res.data;
      console.log('saved user', $scope.user);
      $scope.infoHasChanged = false;
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  };

  $scope.userInfoHasChanged = function() {
    return $scope.infoHasChanged;
  };

  $scope.cookFavoriteRecipe = function(recipe) {
    FavoriteRecipeService.favoriteRecipeUsedForUser({
      userId: $ionicUser.get(USER.ID),
      token: $ionicAuth.getToken(),
      favoriteRecipeId: recipe._id
    }).then(function(res) {
      //nothing yet...
    }, function(response) {
      //nothing yet
    });
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
