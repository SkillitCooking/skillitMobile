'use strict';
angular.module('main')
.controller('CookPresentCtrl', ['_', '$window', '$document', '$scope', '$rootScope', '$stateParams', '$state', 'LibraryFunctions', 'RecipeService', 'MealsCookedService', 'SeasoningUsedService', 'SeasoningProfileService', 'RecipeInstantiationService', 'StepCombinationService', 'SeasoningProfileTextService', 'FavoriteRecipeService', 'FavoriteRecipeDetectionService', 'ProgressiveStepTipService', 'SocialSharingService', 'RecipeNameConstructionService', '$ionicScrollDelegate', '$ionicPopover', '$ionicModal', '$ionicHistory', '$ionicTabsDelegate', '$ionicLoading', '$ionicPlatform', '$ionicPopup', '$ionicAuth', '$ionicUser', 'ErrorService', 'MEALS_COOKED_SOURCE', 'USER', 'LOGIN', 'LOADING', 'FAREWELL_COPY', 'STEP_ICONS', function (_, $window, $document, $scope, $rootScope, $stateParams, $state, LibraryFunctions, RecipeService, MealsCookedService, SeasoningUsedService, SeasoningProfileService, RecipeInstantiationService, StepCombinationService, SeasoningProfileTextService, FavoriteRecipeService, FavoriteRecipeDetectionService, ProgressiveStepTipService, SocialSharingService, RecipeNameConstructionService, $ionicScrollDelegate, $ionicPopover, $ionicModal, $ionicHistory, $ionicTabsDelegate, $ionicLoading, $ionicPlatform, $ionicPopup, $ionicAuth, $ionicUser, ErrorService, MEALS_COOKED_SOURCE, USER, LOGIN, LOADING, FAREWELL_COPY, STEP_ICONS) {

  if(typeof $window.ga !== 'undefined') {
    if($stateParams.cameFromRecipes) {
      $window.ga.trackView('RecipePresent.Recipes');
    } else if($stateParams.isFavoriteRecipe) {
      $window.ga.trackView('RecipePresent.Favorite');
    } else if($stateParams.cameFromRecipeCollection) {
      $window.ga.trackView('RecipePresent.RecipeCollection');
    } else {
      $window.ga.trackView('RecipePresent.Cook');
    }
  }

  function recipeTypeCmpFn(a, b) {
    if(a.recipeType === 'Full' || a.recipeType === 'BYO') {
      return -1;
    }
    if(b.recipeType === 'Full' || b.recipeType === 'BYO') {
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
      if(a.ingredientList.ingredientTypes[0].ingredients[0].name < b.ingredientList.ingredientTypes[0].ingredients[0].name) {
        return -1;
      } else if(a.ingredientList.ingredientTypes[0].ingredients[0].name > b.ingredientList.ingredientTypes[0].ingredients[0].name) {
        return 1;
      } else {
        //then same ingredient
        return 0;
      }
    }
  }

  function ingredientInArray(array, element) {
    console.log('name', element.name);
    return array.findIndex(function(ingred) {
      return ingred.name === element.name;
    }) !== -1;
  }

  function getIngredientsForRecipes(recipes) {
    var ingredientsForRecipes = [];
    var ingredientsUsed = [];
    for (var i = recipes.length - 1; i >= 0; i--) {
      var ingredientsForRecipe = {};
      ingredientsForRecipe.recipeType = recipes[i].recipeType;
      ingredientsForRecipe.name = recipes[i].name;
      ingredientsForRecipe.ingredients = [];
      var ingredientTypes = recipes[i].ingredientList.ingredientTypes;
      for (var j = ingredientTypes.length - 1; j >= 0; j--) {
        var concatIngredients;
        if(ingredientsForRecipe.recipeType === 'BYO') {
          concatIngredients = _.filter(ingredientTypes[j].ingredients, function(ingredient) {
            return ingredient.useInRecipe;
          });
        } else {
          concatIngredients = ingredientTypes[j].ingredients;
        }
        //set multiple ingredients
         for (var k = concatIngredients.length - 1; k >= 0; k--) {
           var foundIngredient = _.find(ingredientsUsed, function(ingredient) {
            return ingredient.standardName === concatIngredients[k].name.standardForm;
           });
           if(foundIngredient) {
            if(!foundIngredient.hasBeenMarked) {
              foundIngredient.hasBeenMarked = true;
              var foundIngredients = recipes[foundIngredient.firstRecipeIndex].ingredientList.ingredientTypes[foundIngredient.typeIndex].ingredients;
              var ingredientToMark = _.find(foundIngredients, function(ingred) {
                return ingred.name.standardForm === foundIngredient.standardName;
              });
              if(ingredientToMark) {
                ingredientToMark.isMultiple = true;
                ingredientToMark.hasBeenUsed = false;
              } else {
                //error
                ErrorService.logError({
                  message: "Cook Present Controller ERROR: ingredientToMark not found in function 'getIngredientsForRecipes'",
                  ingredients: concatIngredients
                });
                ErrorService.showErrorAlert();
              }
            }
            concatIngredients[k].isMultiple = true;
            concatIngredients[k].hasBeenUsed = false;
           } else {
            ingredientsUsed.push({
              standardName: concatIngredients[k].name.standardForm,
              firstRecipeIndex: i,
              typeIndex: j,
              hasBeenMarked: false
            });
           }
         }
        ingredientsForRecipe.ingredients = ingredientsForRecipe.ingredients.concat(concatIngredients);
      }
      ingredientsForRecipe.ingredients.sort(function(a, b) {
        if(a.useInRecipe && !b.useInRecipe)
          return -1;
        if(!a.useInRecipe && b.useInRecipe)
          return 1;
        if(a.inputCategory === 'Starches')
          return -1;
        if(a.inputCategory === 'Protein' && b.inputCategory === 'Vegetables')
          return -1;
        if(b.inputCategory === 'Starches' && a.inputCategory !== 'Starches')
          return 1;
        if(b.inputCategory === 'Protein' && a.inputCategory === 'Vegetables')
          return 1;

        return 0;
      });
      ingredientsForRecipe.ingredients = _.map(ingredientsForRecipe.ingredients, function(ingredient) {
          return {
            name: ingredient.name.standardForm,
            useInRecipe: ingredient.useInRecipe
          };
        }).reduce(function(array, element) {
          //check name or useInRecipe specifically here
          if(!ingredientInArray(array, element)) {
            array.push(element);
          }
          return array;
        },[]);
      ingredientsForRecipes.push(ingredientsForRecipe);
    }
    ingredientsForRecipes.sort(function(a, b) {
      if((a.recipeType === 'BYO' || a.recipeType === 'Full') && (b.recipeType === 'AlaCarte')) {
        return -1;
      }
      if((b.recipeType === 'BYO' || b.recipeType === 'Full') && (a.recipeType === 'AlaCarte')) {
        return 1;
      }
      return 0;
    });
    return ingredientsForRecipes;
  }

  $ionicLoading.show({
    template: LOADING.COOKING_TEMPLATE,
    noBackdrop: true
  });

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    var navigateBack = true;
    if($scope.resetPopup && $scope.resetPopup.pending) {
      $scope.resetPopup.pending = false;
      navigateBack = false;
      $scope.resetPopup.close();
    }
    if($scope.loginPopover && $scope.loginPopover.isShown()) {
      $scope.loginPopover.remove();
      navigateBack = false;
    }
    if($scope.seasonPopover && $scope.seasonPopover.isShown()) {
      //analytics
      if(typeof $window.ga !== 'undefined') {
        var interval = Date.now() - $scope.startSeasonPopoverTime;
        $window.ga.trackTiming('RecipePresent', interval, 'SeasonPopoverTime');
      }
      $scope.seasonPopover.remove();
      navigateBack = false;
    }
    if($scope.stepTipPopver && $scope.stepTipPopver.isShown()) {
      if(typeof $window.ga !== 'undefined') {
        var interval = Date.now() - $scope.stepTipPopverStartTime;
        $window.ga.trackTiming('RecipePresent', interval, 'StepTipTime', $scope.displayStepTip.title);
      }
      $scope.stepTipPopver.remove();
      navigateBack = false;
    }
    if($scope.videoModal && $scope.videoModal.isShown()) {
      $scope.videoModal.remove();
      navigateBack = false;
    }
    if(navigateBack) {
      $scope.navigateBack();
    }
  }, 501);

  //pass on dietaryPreferencesChanged msg
  var dietaryPreferencesChanged = false;
  $scope.$on('dietaryPreferencesChanged', function(event) {
    event.preventDefault();
    dietaryPreferencesChanged = true;
  });

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
    if(typeof $window.ga !== 'undefined') {
      var interval = Date.now() - $scope.timeEntered;
      $window.ga.trackTiming('RecipePresent', interval);
    }
    if(dietaryPreferencesChanged) {
      $rootScope.$broadcast('dietaryPreferencesChanged');
    }
  });

  var userId, userToken;
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    if($ionicAuth.isAuthenticated()) {
      $scope.favoriteRecipeId = FavoriteRecipeDetectionService.getFavoriteId($scope.recipeIds);
      userId = $ionicUser.get(USER.ID);
      userToken = $ionicAuth.getToken();
    }
    $scope.timeEntered = Date.now();
    $scope.mainVideoState = -1; //unstarted
  });

  function getLabel(state) {
    switch(state) {
      case -1:
        return 'unstarted';
      case 0:
        return 'ended';
      case 1:
        return 'playing';
      case 2:
        return 'paused';
      case 3:
        return 'buffering';
      default:
        return 'unknown';
    }
  }

  $scope.$on('youtubeStateChange', function(event, videoId, state) {
    if(typeof $window.ga !== 'undefined') {
      if($scope.playingVideo && $scope.playingVideo.videoId == videoId) {
        if(state !== $scope.mainVideoState) {
          var name = $scope.combinedRecipe.name;
          if(!name) {
            name = $scope.combinedRecipe.mainName;
          }
          if($scope.mainVideoState == -1 && state == 1) { //unstarted && playing
            $scope.mainVideoStarted = Date.now();
            $window.ga.trackEvent('RecipePresent', 'MainVideoStart', name);
            $scope.mainVideoState = state;
          } else
          if($scope.mainVideoState == 1 && state == 2) { //playing and paused
            $scope.mainVideoPaused = Date.now();
            var interval = $scope.mainVideoPaused - $scope.mainVideoStarted;
            $window.ga.trackEvent('RecipePresent', 'MainVideoPaused', name);
            $window.ga.trackTiming('RecipePresent', interval, 'StartToPause', 'MainVideo');
            $scope.mainVideoState = state;
          } else
          if($scope.mainVideoState == 1 && state == 0) { //playing and ended
            $scope.mainVideoEnded = Date.now();
            var interval = $scope.mainVideoEnded - $scope.mainVideoStarted;
            $window.ga.trackEvent('RecipePresent', 'MainVideoEnded', name);
            $window.ga.trackTiming('RecipePresent', interval, 'StartToEnd', 'MainVideo');
            $scope.mainVideoState = state;
          } else 
          if($scope.mainVideoState == 2 && state == 1) { //paused and playing
            $scope.mainVideoStarted = Date.now();
            var interval = $scope.mainVideoStarted - $scope.mainVideoPaused;
            $window.ga.trackEvent('RecipePresent', 'MainVideoRestarted', name);
            $window.ga.trackTiming('RecipePresent', interval, 'PauseToStart', 'MainVideo');
            $scope.mainVideoState = 1;
          } else {
            //other
            var label = getLabel($scope.mainVideoState) + '=>' + getLabel(state);
            $window.ga.trackEvent('RecipePresent', 'UncategorizedMainVideoEvent', label);
          }
        }
      }
    }
  });

  $scope.numberBackToRecipeSelection = $stateParams.numberBackToRecipeSelection;
  $scope.cameFromHome = $stateParams.cameFromHome;
  $scope.cameFromRecipes = $stateParams.cameFromRecipes;
  $scope.isFavoriteRecipe = $stateParams.isFavoriteRecipe;
  $scope.cameFromRecipeCollection = $stateParams.cameFromRecipeCollection;

  if(!$scope.numberBackToRecipeSelection) {
    $scope.numberBackToRecipeSelection = -1;
  }

  function amendSeasonings() {
    for (var i = $scope.combinedRecipe.choiceSeasoningProfiles.length - 1; i >= 0; i--) {
      _.remove($scope.seasoningProfiles, function(profile) {
        return profile._id === $scope.combinedRecipe.choiceSeasoningProfiles[i]._id;
      });
    }
  }

  if($stateParams.sidesAdded || $stateParams.ingredientsChanged) {
    $scope.numberBackToRecipeSelection -= 2;
  }
  $scope.recipeIds = $stateParams.recipeIds;
  //run initial check for favoriting
  if($stateParams.loadAlaCarte) {
    RecipeService.getRecipesOfType('AlaCarte', userId, userToken).then(function(recipes) {
      recipes = recipes.data;
      recipes.sort(ingredientCategoryCmpFn);
      $scope.alaCarteRecipes = recipes;
      $scope.alaCarteSelectedArr = Array($scope.alaCarteRecipes.length).fill(false);
      $scope.sidesExist = false;
    }, function(response) {
      ErrorService.showErrorAlert();
    });
  } else {
    $scope.alaCarteRecipes = $stateParams.alaCarteRecipes;
    $scope.alaCarteSelectedArr = $stateParams.alaCarteSelectedArr;
    $scope.sidesExist = false;
    if($scope.alaCarteSelectedArr) {
      for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
        if($scope.alaCarteSelectedArr[i]) {
          $scope.sidesExist = true;
          break;
        }
      }
    }
  }
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  $scope.selectedIngredientIds = $stateParams.selectedIngredientIds;
  //post mealCooked data
  var source;
  if($scope.cameFromRecipes) {
    source = MEALS_COOKED_SOURCE.RECIPES_TAB;
  } else if($scope.isFavoriteRecipe) {
    source = MEALS_COOKED_SOURCE.FAVORITE;
  } else {
    source = MEALS_COOKED_SOURCE.COOK_TAB;
  }
  var isAnonymous = true;
  if($ionicAuth.isAuthenticated()) {
    isAnonymous = false;
  }
  MealsCookedService.postCookedMeal({
    recipeIds: $scope.recipeIds,
    source: source,
    isAnonymous: isAnonymous,
    ingredientsChosenIds: $scope.selectedIngredientIds,
    deviceToken: ionic.Platform.device().uuid,
    userId: $ionicUser.get(USER.ID, undefined),
    token: $ionicAuth.isAuthenticated()
  }).then(function(res) {
    $scope.curMealCookedId = res.data._id;
  }, function(response) {
    $scope.curMealCookedId = undefined;
  });
  var wrappedRecipeIds = {
    recipeIds: $scope.recipeIds
  };
  RecipeService.getRecipesWithIds(wrappedRecipeIds).then(function(response) {
    var recipes = response.data;
    //analytics
    if(typeof $window.ga !== 'undefined') {
      for (var i = recipes.length - 1; i >= 0; i--) {
        $window.ga.trackEvent('RecipeName', 'selection', recipes[i].name);
        $window.ga.trackEvent('RecipeCategory', 'selection', recipes[i].recipeCategory);
        var activeTime = recipes[i].prepTime;
        if(recipes[i].manActiveTime) {
          activeTime = recipes[i].manActiveTime;
        }
        $window.ga.trackEvent('RecipeActiveTime', 'selection', activeTime);
        var totalTime = recipes[i].totalTime;
        if(recipes[i].manTotalTime) {
          totalTime = recipes[i].manTotalTime;
        }
        $window.ga.trackEvent('RecipeTotalTime', 'selection', totalTime);
        $window.ga.trackEvent('RecipeDefaultSeasoning', 'selection', recipes[i].defaultSeasoningProfile.name);
        for (var j = recipes[i].ingredientList.ingredientTypes.length - 1; j >= 0; j--) {
          var type = recipes[i].ingredientList.ingredientTypes[j];
          for (var k = type.ingredients.length - 1; k >= 0; k--) {
            $window.ga.trackEvent('RecipeIngredient', 'selection', type.ingredients[k].name.standardForm);
          }
        }
      }
    }
    recipes.sort(recipeTypeCmpFn);
    RecipeInstantiationService.cullIngredients(recipes, $scope.selectedIngredientNames, $scope.selectedIngredientIds);
    if($stateParams.nameDefaultSeasoning) {
      for (var i = recipes.length - 1; i >= 0; i--) {
        if(recipes[i].recipeType === 'Full') {
          RecipeNameConstructionService.setNewDefaultSeasoning(recipes[i], $stateParams.nameDefaultSeasoning);
        }
      }
    }
    var BYORecipe = _.find(recipes, function(recipe) {
      return recipe.recipeType === 'BYO';
    });
    if(BYORecipe) {
      $scope.BYOIngredientTypes = BYORecipe.ingredientList.ingredientTypes;
      $scope.BYOName = BYORecipe.name;
    }
    var notFullySatisfiedRecipe = _.find(recipes, function(recipe) {
      return recipe.notFullySatisfied;
    });
    if(notFullySatisfiedRecipe) {
      $scope.notFullySatisfiedRecipeName = notFullySatisfiedRecipe.name;
      $scope.BYOIngredientTypes = [];
      for (var i = notFullySatisfiedRecipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
        if(notFullySatisfiedRecipe.ingredientList.ingredientTypes[i].notFullySatisfied) {
          $scope.BYOIngredientTypes.push(notFullySatisfiedRecipe
            .ingredientList.ingredientTypes[i]);
        }
      }
    }
    $scope.ingredientsForRecipes = getIngredientsForRecipes(recipes);
    RecipeInstantiationService.fillInSteps(recipes);
    RecipeInstantiationService.setBackwardsIsEmptySteps(recipes);
    RecipeInstantiationService.setTheRestIsEmpty(recipes);
    //build the below out later
    $scope.combinedRecipe = StepCombinationService.getCombinedRecipe(recipes, $stateParams.currentSeasoningProfile);
    console.log('combinedRecipe', $scope.combinedRecipe);
    //set pictureURL
    if($stateParams.displayPictureURL) {
      $scope.combinedRecipe.mainPictureURL = $stateParams.displayPictureURL;
    }
    if($stateParams.displayName) {
      if($scope.combinedRecipe.mainName) {
        $scope.combinedRecipe.mainName = $stateParams.displayName;
      } else {
        $scope.combinedRecipe.name = $stateParams.displayName;
      }
    }
    if($stateParams.displayNameType) {
      $scope.combinedRecipe.displayNameType = $stateParams.displayNameType;
    }
    //mainVideo indicator array
    $scope.mainVideoIndicators = [];
    if($scope.combinedRecipe) {
      StepCombinationService.eliminateUnnecesaries($scope.combinedRecipe);
      //ProgressiveStepTipService call
      //ProgressiveStepTipService.organize($scope.combinedRecipe);
      if($stateParams.sidesAdded && $scope.seasoningProfiles) {
        amendSeasonings();
      }
      if($scope.combinedRecipe.mainVideos) {
        $scope.mainVideoIndicators = Array($scope.combinedRecipe.mainVideos.length).fill(false);
        $scope.mainVideoIndicators[0] = true;
        $scope.playingVideo = $scope.combinedRecipe.mainVideos[0];
        console.log('playingVideo here', $scope.playingVideo);
      } else {
        //the single main player
        $scope.playingVideo = $scope.combinedRecipe.mainVideo;
      }
      if((!$scope.selectedIngredientNames || $scope.selectedIngredientNames.length < 1) || (!$scope.selectedIngredientIds || $scope.selectedIngredientIds.length < 1)) {
        var resetNames, resetIds = false;
        if(!$scope.selectedIngredientNames) {
          $scope.selectedIngredientNames = [];
        }
        if($scope.selectedIngredientNames.length === 0) {
          resetNames = true;
        }
        if(!$scope.selectedIngredientIds) {
          $scope.selectedIngredientIds = [];
        }
        if($scope.selectedIngredientIds.length === 0) {
          resetIds = true;
        }
        for (var i = $scope.combinedRecipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
          for (var j = $scope.combinedRecipe.ingredientList.ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
            if(resetNames) {
              $scope.selectedIngredientNames.push($scope.combinedRecipe.ingredientList.ingredientTypes[i].ingredients[j].name.standardForm);
            }
            if(resetIds) {
              $scope.selectedIngredientIds.push({
                _id: $scope.combinedRecipe.ingredientList.ingredientTypes[i].ingredients[j]._id,
                formIds: _.map($scope.combinedRecipe.ingredientList.ingredientTypes[i].ingredients[j].ingredientForms, '_id')
              });
            }
          }
        }
      }
    }
    if($stateParams.currentSeasoningProfile) {
      $scope.seasoningProfile = $stateParams.currentSeasoningProfile;
    } else if($scope.combinedRecipe) {
      //will need to set differently if currentSeasoningProfile being sent from
      //side dish selection
      $scope.seasoningProfile = $scope.combinedRecipe.defaultSeasoningProfile;
    }
    setTimeout(function() {
      $ionicLoading.hide();
    }, 500);
  });
  SeasoningProfileService.getSeasoningProfiles().then(function(response) {
    $scope.seasoningProfiles = response.data;
  });

  //watch for seasoningProfiles and combinedRecipe
  var deregistrationSeasoning = $scope.$watch('seasoningProfiles', function(newValue, oldValue) {
    if(newValue && newValue.length) {
      if($scope.combinedRecipeLoaded) {
        //take out seasonings
        amendSeasonings();
        deregistrationSeasoning();
      } else {
        $scope.seasoningProfilesLoaded = true;
      }
    }
  });

  var deregistrationRecipe = $scope.$watch('combinedRecipe', function(newValue, oldValue) {
    if(newValue && newValue.ingredientList) {
      if($scope.seasoningProfilesLoaded) {
        //take out seasonings
        amendSeasonings();
        deregistrationRecipe();
      } else {
        $scope.combinedRecipeLoaded = true;
      }
    } 
  });
  

  $scope.fromCookTab = function() {
    return !$scope.cameFromHome && !$scope.cameFromRecipes && !$scope.cameFromRecipeCollection;
  };

  $scope.isError = function() {
    return ErrorService.isErrorAlready;
  };

  $scope.isSingleStep = function(step) {
    if(!step.isEmpty) {
      if(step.text) {
        return true;
      } else if (step.textArr) {
        return false;
      } else {
        //error
        ErrorService.logError({
          message: "Cook Present Controller ERROR: step has neither text nor textArr in function 'isSingleStep'",
          step: step
        });
        ErrorService.showErrorAlert();
      }
    }
  };

  $scope.getAddSideText = function() {
    if($scope.sidesExist) {
      return 'Change';
    } else {
      return 'Add a Side';
    }
  };

  $scope.addSide = function() {
    if(typeof $window.ga !== 'undefined') {
      $window.ga.trackEvent('RecipePresent', 'click', 'AddSideButton');
    }
    if($scope.cameFromHome) {
      $state.go('main.cookAddSideHome', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
    } else if($scope.isFavoriteRecipe) {
      $state.go('main.cookAddSideFavorite', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
    } else if($scope.cameFromRecipes) {
      $state.go('main.cookAddSideRecipes', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
    } else if($scope.cameFromRecipeCollection) {
      $state.go('main.cookAddSideRecipes', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection, cameFromRecipes: false, cameFromRecipeCollection: true});
    } else {
      $state.go('main.cookAddSide', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
    }
  };

  $scope.getEditIngredientsButtonText = function() {
    //use BYOName as proxy for BYO recipe presence
    if($scope.BYOName) {
      return 'Change';
    } else {
      //then we have a minNeeded < type.ingredients.length Full
      return 'Modify';
    }
  };

  $scope.editBYOIngredients = function() {
    var recipeName;
    //analytics
    if(typeof $window.ga !== 'undefined') {
      var name = $scope.combinedRecipe.name;
      if(!name) {
        name = $scope.combinedRecipe.mainName;
      }
      $window.ga.trackEvent('RecipePresent', 'EditIngredientsClicked', name);
    }
    if($scope.notFullySatisfiedRecipeName) {
      recipeName = $scope.notFullySatisfiedRecipeName;
    } else if($scope.BYOName) {
      recipeName = $scope.BYOName;
    }
    if($scope.cameFromRecipes) {
      $state.go('main.editBYOIngredientsRecipes', {
        alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection, BYOIngredientTypes: $scope.BYOIngredientTypes, BYOName: recipeName
      });
    } else if($scope.isFavoriteRecipe) {
      $state.go('main.editBYOIngredientsFavorite', {
        alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection, BYOIngredientTypes: $scope.BYOIngredientTypes, BYOName: recipeName
      });
    } else {
      $state.go('main.editBYOIngredients', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, selectedIngredientIds: $scope.selectedIngredientIds, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection, BYOIngredientTypes: $scope.BYOIngredientTypes, BYOName: recipeName});
    }
  };

  //first have popup show both cases
  $scope.showTip = function(step, event) {
    if(step.stepType === 'Season' && $scope.combinedRecipe.canAddSeasoningProfile) {
      $ionicPopover.fromTemplateUrl('main/templates/seasoning-profile-selector.html', 
        {scope: $scope}).then(function(popover) {
        $rootScope.redrawSlides = true;
        $scope.seasonPopover = popover;
        $scope.startSeasonPopoverTime = Date.now();
        $scope.seasonPopover.show(event);
      });
    } else if(step.hasTip || step.stepTips.length > 1) {
      //analytics
      $scope.stepTipStep = step;
      if(typeof $window.ga !== 'undefined') {
        var name = $scope.combinedRecipe.name;
        if(!name) {
          name = $scope.combinedRecipe.mainName;
        }
        $window.ga.trackEvent('RecipePresent', 'stepTipClicked', name);
        $window.ga.trackEvent('RecipePresent', 'stepTipClicked', $scope.stepTipStep.stepTips[0].title);
      }
      $scope.selectedTipArr = Array($scope.stepTipStep.stepTips.length).fill(false);
      $scope.selectedTipArr[0] = true;
      $scope.displayStepTip = $scope.stepTipStep.stepTips[0];
      $ionicPopover.fromTemplateUrl('main/templates/step-tip-popover.html', 
        {scope: $scope}).then(function(popover) {
        $rootScope.redrawSlides = true;
        $scope.stepTipPopver = popover;
        //analytics
        $scope.stepTipPopverStartTime = Date.now();
        $scope.stepTipPopver.show(event);
      });
    } else if(step.hasVideo) {
      //analytics
      $scope.stepVideo = step.stepTips[0].videoInfo;
      console.log('stepVideo', $scope.stepVideo);
      if(typeof $window.ga != 'undefined') {
        var name = $scope.combinedRecipe.name;
        if(!name) {
          name = $scope.combinedRecipe.mainName;
        }
        $window.ga.trackEvent('RecipePresent', 'StepVideoClick', name);
        $window.ga.trackEvent('RecipePresent', 'StepVideoClick', $scope.stepVideo.videoId);
      }
      $ionicModal.fromTemplateUrl('main/templates/video-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        //has to be a cleaner way than just setting shit on $rootScope like below...
        $rootScope.redrawSlides = true;
        $scope.videoModal = modal;
        $scope.videoModal.show();
      });
    }
  };

  $scope.closeModal = function() {
    $scope.videoModal.hide();
    $scope.videoModal.remove();
  };

  $scope.closeLoginPopover = function() {
    if($scope.loginPopover) {
      $scope.loginPopover.remove();
    }
  };

  $scope.$on('$destroy', function() {
    if($scope.seasonPopover) {
      if(typeof $window.ga !== 'undefined') {
        var interval = Date.now() - $scope.startSeasonPopoverTime;
        $window.ga.trackTiming('RecipePresent', interval, 'SeasonPopoverTime');
      }
      $scope.seasonPopover.remove();
    }
    if($scope.stepTipPopver) {
      if(typeof $window.ga !== 'undefined') {
        var interval = Date.now() - $scope.stepTipPopverStartTime;
        $window.ga.trackTiming('RecipePresent', interval, 'StepTipTime', $scope.displayStepTip.title);
      }
      $scope.stepTipPopver.remove();
    }
    if($scope.videoModal) {
      $scope.videoModal.remove();
    }
    if($scope.loginPopover) {
      $scope.loginPopover.remove();
    }
  });

  $scope.$on('modal.hidden', function() {
    $scope.videoModal.remove();
  });

  /*$scope.$on('modal.removed', function() {
    $scope.modal.remove();
  });*/

  $scope.incrementMainVideo = function() {
    //indexOf true
    var curIndex = $scope.mainVideoIndicators.indexOf(true);
    if(curIndex < $scope.mainVideoIndicators.length - 1) {
      $scope.mainVideoIndicators.fill(false);
      $scope.mainVideoIndicators[curIndex+1] = true;
      $scope.playingVideo = $scope.combinedRecipe.mainVideos[curIndex+1];
    }
  };

  $scope.decrementMainVideo = function() {
    //indexOf true
    var curIndex = $scope.mainVideoIndicators.indexOf(true);
    if(curIndex > 0) {
      $scope.mainVideoIndicators.fill(false);
      $scope.mainVideoIndicators[curIndex-1] = true;
      $scope.playingVideo = $scope.combinedRecipe.mainVideos[curIndex-1];
    }
  };

  $scope.toggleMainVideo = function(index) {
    //if false clicked, to true, and true to false
    if(!$scope.mainVideoIndicators[index]) {
      $scope.mainVideoIndicators.fill(false);
      $scope.mainVideoIndicators[index] = true;
      $scope.playingVideo = $scope.combinedRecipe.mainVideos[index];
      $scope.mainVideoState = -1; //unstarted
    }
  };

  $scope.getMainVideoDotClass = function(index) {
    if($scope.mainVideoIndicators[index]) {
      return 'ion-ios-circle-filled';
    } else {
      return 'ion-ios-circle-outline';
    }
  };

  $scope.getRecipeActiveTime = function() {
    if($scope.combinedRecipe) {
      if($scope.combinedRecipe.manActiveTime && $scope.combinedRecipe.manActiveTime !== '') {
        return $scope.combinedRecipe.manActiveTime;
      } else {
        return $scope.combinedRecipe.prepTime;
      }
    }
  };

  $scope.getRecipeTotalTime = function() {
    if($scope.combinedRecipe) {
      if($scope.combinedRecipe.manTotalTime && $scope.combinedRecipe.manTotalTime !== '') {
        return $scope.combinedRecipe.manTotalTime;
      } else {
        return $scope.combinedRecipe.totalTime;
      }
    }
  };

  $scope.selectStepTip = function(index) {
    $scope.selectedTipArr.fill(false);
    $scope.selectedTipArr[index] = true;
    $scope.displayStepTip = $scope.stepTipStep.stepTips[index];
  };

  $scope.getStepTipButtonClass = function(index) {
    if($scope.selectedTipArr[index]) {
      return "button button-royal";
    } else {
      return "button button-royal button-outline";
    }
  };

  $scope.tipHasText = function() {
    if($scope.displayStepTip.text && $scope.displayStepTip.text !== "") {
      return true;
    } else {
      return false;
    }
  };

  $scope.tipHasVideo = function() {
    if($scope.displayStepTip.videoInfo && $scope.displayStepTip.videoInfo.videoId) {
      return true;
    } else {
       return false;
    }
  };

  $scope.getStepIconSrc = function(type) {
    switch(type) {
      case 'video':
        return STEP_ICONS.VIDEO;
      case 'tip':
        return STEP_ICONS.TIP;
      case 'seasoning':
        return STEP_ICONS.SEASONING;
      default:
        break;
    }
  };

  $scope.getSeasoningParts = function(profile) {
    return profile.spices.join(', ');
  };

  $scope.seasoningProfilePopup = function(event) {
    //analytics
    if(typeof $window.ga !== 'undefined') {
      $window.ga.trackEvent('RecipePresent', 'click', 'SpiceUpLifeButton');
    }
    $ionicPopover.fromTemplateUrl('main/templates/seasoning-profile-selector.html', 
        {scope: $scope}).then(function(popover) {
        $rootScope.redrawSlides = true;
        $scope.seasonPopover = popover;
        $scope.startSeasonPopoverTime = Date.now();
        $scope.seasonPopover.show(event);
    });
  };

  $scope.capitalize = function(spice) {
    return spice.charAt(0).toUpperCase() + spice.substring(1);
  };

  $scope.showMoreProfiles = false;
  $scope.showMoreSeasonings = function() {
    //analytics
    if(typeof $window.ga !== 'undefined') {
      $window.ga.trackEvent('RecipePresent', 'click', 'SpiceSelectionMore');
    }
    $scope.showMoreProfiles = true;
  };

  $scope.showOtherProfiles = function() {
    return $scope.showMoreProfiles;
  };

  $scope.changeSeasoningProfileOther = function(profile) {
    if($scope.seasonPopover) {
      setTimeout(function() {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.startSeasonPopoverTime;
          $window.ga.trackTiming('RecipePresent', interval, 'SeasonPopoverTime');
          $window.ga.trackEvent('RecipePresent', 'SeasonSelection', profile.name);
        }
        $scope.seasonPopover.remove();
      }, 200);
    }
    RecipeNameConstructionService.switchNameForSeasoning($scope.combinedRecipe, profile);
    $scope.showMoreProfiles = false;
    $scope.combinedRecipe.choiceSeasoningProfiles.push(profile);
    _.remove($scope.seasoningProfiles, function(season) {
      return profile._id === season._id;
    });
    $scope.seasoningProfile = profile;
    if($scope.curMealCookedId) {
      var isAnonymous = true;
      if($ionicAuth.isAuthenticated()) {
        isAnonymous = false;
      }
      SeasoningUsedService.postSeasoningUsed({
        seasoningId: profile._id,
        mealCookedId: $scope.curMealCookedId,
        isAnonymous: isAnonymous,
        userId: $ionicUser.get(USER.ID, undefined),
        token: $ionicAuth.getToken()
      }).then(function(res) {
        //do nothing - don't need any return info
      }, function(response) {
        //do nothing - don't want the logging error to upset the user
      });
    }
    for (var i = $scope.combinedRecipe.stepList.length - 1; i >= 0; i--) {
      if($scope.combinedRecipe.stepList[i].stepType === 'Season') {
        SeasoningProfileTextService.addSeasoning($scope.combinedRecipe.stepList[i], $scope.seasoningProfile);
      }
    }
  };

  $scope.changeSeasoningProfile = function(profile) {
    if($scope.seasonPopover) {
      setTimeout(function() {
        //analytics
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.startSeasonPopoverTime;
          $window.ga.trackTiming('RecipePresent', interval, 'SeasonPopoverTime');
          $window.ga.trackEvent('RecipePresent', 'SeasonSelection', profile.name);
        }
        $scope.seasonPopover.remove();
      }, 200);
    }
    RecipeNameConstructionService.switchNameForSeasoning($scope.combinedRecipe, profile);
    $scope.showMoreProfiles = false;
    $scope.seasoningProfile = profile;
    if($scope.curMealCookedId) {
      var isAnonymous = true;
      if($ionicAuth.isAuthenticated()) {
        isAnonymous = false;
      }
      SeasoningUsedService.postSeasoningUsed({
        seasoningId: profile._id,
        mealCookedId: $scope.curMealCookedId,
        isAnonymous: isAnonymous,
        userId: $ionicUser.get(USER.ID, undefined),
        token: $ionicAuth.getToken(),
        deviceToken: ionic.Platform.device().uuid
      }).then(function(res) {
        //do nothing - don't need any return info
      }, function(response) {
        //do nothing - don't want the logging error to upset the user
      });
    }
    for (var i = $scope.combinedRecipe.stepList.length - 1; i >= 0; i--) {
      if($scope.combinedRecipe.stepList[i].stepType === 'Season') {
        SeasoningProfileTextService.addSeasoning($scope.combinedRecipe.stepList[i], $scope.seasoningProfile);
      }
    }
  };

  $scope.closeSeasoningPopup = function() {
    if($scope.seasonPopover) {
      setTimeout(function() {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.startSeasonPopoverTime;
          $window.ga.trackTiming('RecipePresent', interval, 'SeasonPopoverTime');
        }
        $scope.seasonPopover.remove();
      }, 100);
    }
  };

  $scope.closeTip = function() {
    if($scope.stepTipPopver) {
      setTimeout(function() {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.stepTipPopverStartTime;
          $window.ga.trackTiming('RecipePresent', interval, 'StepTipTime', $scope.displayStepTip.title);
        }
        $scope.stepTipPopver.remove();
      }, 100);
    }
  };

  $scope.navigateBack = function() {
    //need to get timesclicked mechanism going here
    if($scope.alaCarteSelectedArr) {
      for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
        $scope.alaCarteSelectedArr.fill(false);
      }
      if($scope.cameFromHome) {
        $ionicHistory.goBack($scope.numberBackToRecipeSelection);
      } else if($scope.cameFromRecipes) {
        $ionicHistory.goBack($scope.numberBackToRecipeSelection + 1);
      } else if($scope.cameFromRecipeCollection) {
        $ionicHistory.goBack($scope.numberBackToRecipeSelection);
      } else { 
        $ionicHistory.goBack($scope.numberBackToRecipeSelection);
      }
    }
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
        $ionicHistory.clearCache().then(function() {
          $state.go('main.cook');
        }, function(error) {
          //error
          ErrorService.logError({ 
            message: "Cook Present Controller ERROR: failed to clear $ionicHistory cache in function 'resetEverything'",
            error: error
          });
          ErrorService.showErrorAlert();
        });
      }
    });
  };

  $scope.constituentRecipes = function() {
    if($scope.combinedRecipe) {
      if($scope.combinedRecipe.isComposedRecipe) {
        return true;
      }
    }
    return false;
  };

  $scope.categoryNeedsOilOrButter = function() {
    if($scope.combinedRecipe) {
      if($scope.combinedRecipe.recipeCategory) {
        switch($scope.combinedRecipe.recipeCategory) {
          case 'Scramble':
          case 'Roast':
          case 'Pasta':
          case 'Hash':
          case 'Rice':
          case 'Quinoa':
          case 'Easy Dinners':
          case 'Seafood Plates':
          case 'Sautee':
            return true;
          default:
            return false;
        }
      } else if($scope.combinedRecipe.recipeCategorys) {
        for (var i = $scope.combinedRecipe.recipeCategorys.length - 1; i >= 0; i--) {
          switch($scope.combinedRecipe.recipeCategorys[i]) {
            case 'Scramble':
            case 'Roast':
            case 'Pasta':
            case 'Hash':
            case 'Rice':
            case 'Quinoa':
            case 'Easy Dinners':
            case 'Seafood Plates':
            case 'Sautee':
              return true;
            default:
              break;
          }
        }
        return false;
      }
    }
  };

  $scope.getSubStepNumber = function(subStep, source) {
    return subStep.stepNumber;
  };

  $scope.clickableStep = function(step) {
    if((step.hasTip || step.hasVideo) || (step.stepType === 'Season' && $scope.combinedRecipe.canAddSeasoningProfile)) {
      return 'clickableStepClass';
    }
  };
  $scope.isClickable = function(step) {
    if((step.hasTip || step.hasVideo) || (step.stepType === 'Season' && $scope.combinedRecipe.canAddSeasoningProfile)) {
      return true;
    }
  };

  $scope.unfavoriteRecipe = function(event) {
    //analytics
    if(typeof $window.ga !== 'undefined') {
      var name = $scope.combinedRecipe.name;
      if(!name) {
        name = $scope.combinedRecipe.mainName;
      }
      $window.ga.trackEvent('RecipePresent', 'RecipeUnFavorited', name);
    }
    if($ionicAuth.isAuthenticated()) {
      $ionicLoading.show({
        template: LOADING.DEFAULT_TEMPLATE,
        noBackdrop: true
      });
      FavoriteRecipeService.unfavoriteRecipe({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken(),
        favoriteRecipeId: $scope.favoriteRecipeId
      }).then(function(res) {
        $scope.favoriteRecipeId = false;
        $rootScope.$broadcast('recipeUnfavorited');
        $ionicLoading.hide();
      }, function(response) {
        $ionicLoading.hide();
        ErrorService.showErrorAlert();
      });
    }
  };

  $scope.favoriteRecipe = function (event) {
    //analytics
    if(typeof $window.ga !== 'undefined') {
      var name = $scope.combinedRecipe.name;
      if(!name) {
        name = $scope.combinedRecipe.mainName;
      }
      $window.ga.trackEvent('RecipePresent', 'RecipeFavorited', name);
    }
    if($ionicAuth.isAuthenticated()) {
      var name;
      if($scope.combinedRecipe.name) {
        name = $scope.combinedRecipe.name;
      } else {
        name = $scope.combinedRecipe.mainName;
        if($scope.combinedRecipe.alaCarteNames) {
          name += " plus " + $scope.combinedRecipe.alaCarteNames;
        }
      }
      FavoriteRecipeService.saveFavoriteRecipeForUser({
        userId: $ionicUser.get(USER.ID),
        token: $ionicAuth.getToken(),
        favoriteRecipe: {
          userId: $ionicUser.get(USER.ID),
          recipeIds: $scope.recipeIds,
          ingredientAndFormIds: $scope.selectedIngredientIds,
          ingredientNames: $scope.selectedIngredientNames,
          lastSeasoningProfileUsedId: $scope.seasoningProfile._id,
          name: name,
          mainPictureURL: $scope.combinedRecipe.mainPictureURL,
          prepTime: $scope.getRecipeActiveTime(),
          totalTime: $scope.getRecipeTotalTime()
        }
      }).then(function(res) {
        //set favoriteId
        $scope.favoriteRecipeId = res.data._id;
        $rootScope.$broadcast('newRecipeFavorited');
        $ionicPopup.alert({
         title: 'Congrats!',
         template: 'This Recipe is now a Favorite!'
       });
      }, function(response) {
        ErrorService.showErrorAlert();
      });
    } else {
      //show popover
      $ionicPopover.fromTemplateUrl('main/templates/login-popover.html', 
        {scope: $scope}).then(function(popover) {
        $rootScope.redrawSlides = true;
        $scope.loginPopover = popover;
        $scope.loginPopover.show(event);
        //then, after successful login, want to actually save the recipe to favorites, and then return to the presentation page, as opposed to going to cook-ctrl
        //could have login directive emit...
      });
    }
  };

  $scope.$on('loginDirective.successfulPopover', function(event) {
    console.log('here');
    event.preventDefault();
    $scope.favoriteRecipe();
  });

  $scope.$on('signInStart', function(event){
    event.preventDefault();
    $ionicLoading.show({
      template: LOADING.DEFAULT_TEMPLATE,
      noBackdrop: true
    });
  });
  $scope.$on('signInStop', function(event, removePopover, fetchRecipes) {
    event.preventDefault();
    $ionicLoading.hide();
    if(removePopover && $scope.loginPopover) {
      $scope.loginPopover.remove();
    }
  });

  $scope.socialShareMeal = function(type) {
    if(typeof $window.ga !== 'undefined') {
      var name;
      if($scope.combinedRecipe.mainName) {
        name = $scope.combinedRecipe.mainName;
      } else {
        name = $scope.combinedRecipe.name;
      }
      $window.ga.trackEvent('SocialMealShare', name, type);
    }
    if(type === 'facebook') {
      SocialSharingService.shareMealFacebook($scope.combinedRecipe);
    } else if(type === 'twitter') {
      SocialSharingService.shareMealTwitter($scope.combinedRecipe);
    }
  };

  $scope.mainVideoClicked = function() {
    if(typeof $window.ga !== 'undefined') {
      var name = $scope.combinedRecipe.name;
      if($scope.combinedRecipe.mainName) {
        name = $scope.combinedRecipe.mainName;
      }
      $window.ga.trackEvent('RecipePresent', 'mainVideoClick', name);
    }
  };

  $scope.getMainPictureURL = function() {
    //will need to set main picture URL combined recipe
    
  };

  function getFarewellCopy() {
    var index = LibraryFunctions.getRandomIndex(FAREWELL_COPY.length);
    return FAREWELL_COPY[index];
  }

  $scope.farewellCopy = getFarewellCopy();

  $scope.hasLoggedReachingBottom = false;
  $scope.checkScroll = function() {
    if(typeof $window.ga !== 'undefined' && !$scope.hasLoggedReachingBottom) {
      var buffer = 120;
      var currentTop = $ionicScrollDelegate.$getByHandle('cook-present').getScrollPosition().top;
      var maxFromTop = $ionicScrollDelegate.$getByHandle('cook-present').getScrollView().__maxScrollTop;
      if(currentTop >= maxFromTop - buffer) {
        var name = $scope.combinedRecipe.name;
        if(!name) {
          name = $scope.combinedRecipe.mainName;
        }
        $window.ga.trackEvent('RecipePresent', 'ScrolledToBottom', name);
        $scope.hasLoggedReachingBottom = true;
      }
    }
  };
}]);
