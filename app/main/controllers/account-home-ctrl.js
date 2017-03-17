'use strict';
angular.module('main')
.controller('AccountHomeCtrl', ['_', '$window', '$rootScope', '$scope', '$state', '$ionicHistory', '$ionicLoading', '$ionicAuth', '$ionicGoogleAuth', '$ionicFacebookAuth', '$ionicUser', '$ionicPopover', 'UserService', 'FavoriteRecipeService', 'DietaryPreferencesService', 'ErrorService', 'USER', 'LOGIN', 'LOADING', function (_, $window, $rootScope, $scope, $state, $ionicHistory, $ionicLoading, $ionicAuth, $ionicGoogleAuth, $ionicFacebookAuth, $ionicUser, $ionicPopover, UserService, FavoriteRecipeService, DietaryPreferencesService, ErrorService, USER, LOGIN, LOADING) {

  $scope.ages = USER.AGES;
  $scope.accountInfoSelected = false;
  $scope.favRecipeSelected = true;
  $scope.favoriteRecipes = [];
  $scope.infoHasChanged = false;

  if(typeof $window.ga !== 'undefined') {
    $window.ga.trackView('AccoutHome');
  }

  $scope.$on('signInStart', function(event) {
    event.preventDefault();
    $ionicLoading.show({
      template: LOADING.DEFAULT_TEMPLATE,
      noBackdrop: true
    });
  });

  $scope.nextPageNumber = 1;

  function favoriteRecipeEventHandler(event) {
    if(event) {
      event.preventDefault();
    }
    FavoriteRecipeService.getFavoriteRecipesForUser({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken()
      }).then(function(res) {
        $scope.favoriteRecipes = res.data;
        var favoriteRecipeIds = _.map($scope.favoriteRecipes, function(favRecipe) {
          return {
            _id: favRecipe._id,
            recipeIds: favRecipe.recipeIds
          };
        });
        $ionicUser.set('favoriteRecipeIds', favoriteRecipeIds);
        $ionicUser.save();
        //set favorite recipes to $ionicUser
      }, function(response) {
        ErrorService.showErrorAlert();
      });
  }

  $scope.$on('recipeUnfavorited', function(event) {
    favoriteRecipeEventHandler(event);
  });

  $scope.$on('newRecipeFavorited', function(event) {
    favoriteRecipeEventHandler(event);
  });

  $scope.$on('signInStop', function(event, removePopover, fetchRecipes) {
    event.preventDefault();
    if(fetchRecipes) {
      FavoriteRecipeService.getFavoriteRecipesForUser({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken()
      }).then(function(res) {
        $scope.favoriteRecipes = res.data;
        //set fav recipes to $ionicUser
         var favoriteRecipeIds = _.map($scope.favoriteRecipes, function(favRecipe) {
          return {
            _id: favRecipe._id,
            recipeIds: favRecipe.recipeIds
          };
        });
        $ionicUser.set('favoriteRecipeIds', favoriteRecipeIds);
        $ionicUser.save();
        $ionicLoading.hide();
      }, function(response) {
        ErrorService.showErrorAlert();
      });
      UserService.getPersonalInfo({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken()
      }).then(function(res) {
        $scope.user = res.data;
        $ionicUser.set('dietaryPreferences', $scope.user.dietaryPreferences);
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
      //set favorite recipes to $ionicUser
       var favoriteRecipeIds = _.map($scope.favoriteRecipes, function(favRecipe) {
          return {
            _id: favRecipe._id,
            recipeIds: favRecipe.recipeIds
          };
        });
        $ionicUser.set('favoriteRecipeIds', favoriteRecipeIds);
        $ionicUser.save();
    }, function(response) {
      ErrorService.showErrorAlert();
    });
    UserService.getPersonalInfo({
      userId: $ionicUser.get(USER.ID),
      token: $ionicAuth.getToken()
    }).then(function(res) {
      $scope.user = res.data;
      $ionicUser.set('dietaryPreferences', $scope.user.dietaryPreferences);
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
    if(typeof $window.ga !== 'undefined') {
      $window.ga.trackEvent('FavoriteRecipesSelected', 'selected');
    }
    $scope.favRecipeSelected = true;
    $scope.accountInfoSelected = false;
  };

  $scope.selectAccountInfo = function() {
    if(typeof $window.ga !== 'undefined') {
      $window.ga.trackEvent('AccountInfoSelected', 'selected');
    }
    $scope.accountInfoSelected = true;
    $scope.favRecipeSelected = false;
  };

  $scope.isAuthenticated = function() {
    return $ionicAuth.isAuthenticated();
  };

  $scope.changeUserInfo = function() {
    if($scope.infoHasChanged && typeof $window.ga !== 'undefined') {
      var action = "changed";
      var label = $ionicUser.get(USER.ID);
      $window.ga.trackEvent('DietaryPrefence', action, label);
    }
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
    if(typeof $window.ga !== 'undefined') {
      var action = 'saved';
      var label = $ionicUser.get(USER.ID);
      $window.ga.trackEvent('UserInfoSaved', action, label);
    }
    var dietaryPreferences = [];
    for (var i = $scope.dietaryPreferences.length - 1; i >= 0; i--) {
      if($scope.dietaryPreferences[i].isMarked) {
        dietaryPreferences.push($scope.dietaryPreferences[i]);
      }
    }
    $ionicUser.set('dietaryPreferences', dietaryPreferences);
    //so as to reload cook-ctrl ingredients
    $rootScope.$broadcast('dietaryPreferencesChanged');
    $rootScope.redrawSlides = true;
    $ionicLoading.show({
      template: LOADING.DEFAULT_TEMPLATE,
      noBackdrop: true
    });
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
      $scope.infoHasChanged = false;
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  };

  $scope.userInfoHasChanged = function() {
    return $scope.infoHasChanged;
  };

  $scope.cookFavoriteRecipe = function(recipe) {
    if(typeof $window.ga !== 'undefined') {
      var action = recipe.name;
      var label = $ionicUser.get(USER.ID);
      $window.ga.trackEvent('FavoriteRecipeCooked', action, label);
    }
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
      alaCarteSelectedArr: [],
      isNewLoad: true
    });
  };

  $scope.unfavoriteRecipe = function(favRecipe) {
    if(typeof $window.ga !== 'undefined') {
      var action = favRecipe.name;
      var label = $ionicUser.get(USER.ID);
      $window.ga.trackEvent('RecipeUnfavorited', action, label);
    }
    if($ionicAuth.isAuthenticated()) {
      $ionicLoading.show({
        template: LOADING.DEFAULT_TEMPLATE,
        noBackdrop: true
      });
      FavoriteRecipeService.unfavoriteRecipe({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken(),
        favoriteRecipeId: favRecipe._id
      }).then(function(res) {
        FavoriteRecipeService.getFavoriteRecipesForUser({
          userId: $ionicUser.get(USER.ID),
          token: $ionicAuth.getToken()
        }).then(function(res) {
          $scope.favoriteRecipes = res.data;
          var favoriteRecipeIds = _.map($scope.favoriteRecipes, function(favRecipe) {
            return {
              _id: favRecipe._id,
              recipeIds: favRecipe.recipeIds
            };
          });
          $ionicUser.set('favoriteRecipeIds', favoriteRecipeIds);
          $ionicUser.save();
          $ionicLoading.hide();
          //set favorite recipes to $ionicUser
        }, function(response) {
          $ionicLoading.hide();
          ErrorService.showErrorAlert();
        });
      }, function(response) {
        $ionicLoading.hide();
        ErrorService.showErrorAlert();
      });
    }
  };

  $scope.logout = function() {
    if(typeof $window.ga !== 'undefined') {
      var label = 'userId';
      var action = $ionicUser.get(USER.ID);
      $window.ga.trackEvent('Logout', action, label);
    }
    var userId = $ionicUser.get(USER.ID);
    var token = $ionicAuth.getToken();
    var loginType = $ionicUser.get(LOGIN.TYPE);
    $ionicUser.unset(LOGIN.TYPE);
    $ionicUser.save();
    $ionicLoading.show({
      template: LOADING.DEFAULT_TEMPLATE,
      noBackdrop: true
    });
    if(loginType === LOGIN.BASIC) {
      $ionicAuth.logout();
    } else if(loginType === LOGIN.FACEBOOK) {
      $ionicFacebookAuth.logout();
    } else if(loginType === LOGIN.GOOGLE) {
      $ionicGoogleAuth.logout();
    } else {
      //unrecognized login type
      //ErrorService.showErrorAlert();
    }
    $ionicHistory.clearHistory();
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
