'use strict';
angular.module('main')
.controller('CookPresentCtrl', ['_', '$scope', '$stateParams', '$state', 'RecipeService', 'SeasoningProfileService', 'RecipeInstantiationService', 'StepCombinationService', 'SeasoningProfileTextService', '$ionicPopover', '$ionicModal', '$ionicHistory', '$ionicNavBarDelegate', function (_, $scope, $stateParams, $state, RecipeService, SeasoningProfileService, RecipeInstantiationService, StepCombinationService, SeasoningProfileTextService, $ionicPopover, $ionicModal, $ionicHistory, $ionicNavBarDelegate) {

  function getIngredientsForRecipes(recipes) {
    var ingredientsForRecipes = [];
    for (var i = recipes.length - 1; i >= 0; i--) {
      var ingredientsForRecipe = {};
      ingredientsForRecipe.recipeType = recipes[i].recipeType;
      ingredientsForRecipe.name = recipes[i].name;
      ingredientsForRecipe.ingredients = [];
      var ingredientTypes = recipes[i].ingredientList.ingredientTypes;
      for (var j = ingredientTypes.length - 1; j >= 0; j--) {
        ingredientsForRecipe.ingredients = ingredientsForRecipe.ingredients.concat(ingredientTypes[j].ingredients);
      }
      ingredientsForRecipe.ingredients = _.map(ingredientsForRecipe.ingredients, function(ingredient) {
          return ingredient.name;
        });
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

  $scope.$on('$ionicView.enter', function(event, data) {
    $ionicNavBarDelegate.showBackButton(false);
  });

  $scope.numberBackToRecipeSelection = $stateParams.numberBackToRecipeSelection;

  if($stateParams.sidesAdded) {
    $scope.numberBackToRecipeSelection -= 2;
  }

  if(!$scope.numberBackToRecipeSelection) {
    $scope.numberBackToRecipeSelection = -1;
  }
  $scope.recipeIds = $stateParams.recipeIds;
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
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  var wrappedRecipeIds = {
    recipeIds: $scope.recipeIds
  };
  RecipeService.getRecipesWithIds(wrappedRecipeIds).then(function(response) {
    var recipes = response.data;
    RecipeInstantiationService.cullIngredients(recipes, $scope.selectedIngredientNames);
    $scope.ingredientsForRecipes = getIngredientsForRecipes(recipes);
    RecipeInstantiationService.fillInSteps(recipes);
    RecipeInstantiationService.setBackwardsIsEmptySteps(recipes);
    RecipeInstantiationService.setTheRestIsEmpty(recipes);
    //build the below out later
    $scope.combinedRecipe = StepCombinationService.getCombinedRecipe(recipes, $stateParams.currentSeasoningProfile);
    //mainVideo indicator array
    $scope.mainVideoUrlIndicators = [];
    if($scope.combinedRecipe) {
      if($scope.combinedRecipe.mainVideoURLs) {
        $scope.mainVideoUrlIndicators = Array($scope.combinedRecipe.mainVideoURLs.length).fill(false);
        $scope.mainVideoUrlIndicators[0] = true;
        $scope.playingVideoURL = $scope.combinedRecipe.mainVideoURLs[0];
      }
    }
    if($stateParams.currentSeasoningProfile) {
      $scope.seasoningProfile = $stateParams.currentSeasoningProfile;
    } else if($scope.combinedRecipe) {
      //will need to set differently if currentSeasoningProfile being sent from
      //side dish selection
      $scope.seasoningProfile = $scope.combinedRecipe.defaultSeasoningProfile;
    }
  });
  SeasoningProfileService.getSeasoningProfiles().then(function(response) {
    $scope.seasoningProfiles = response.data;
  });

  $scope.isSingleStep = function(step) {
    if(step.text) {
      return true;
    } else if (step.textArr) {
      return false;
    } else {
      //error
      console.log("step has neither text nor textArr: ", step);
    }
  };

  $scope.getAddSideText = function() {
    if($scope.sidesExist) {
      return 'Change Sides';
    } else {
      return 'Add a Side Dish';
    }
  };

  $scope.addSide = function() {
    $state.go('main.cookAddSide', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
  };

  //first have popup show both cases; then do automatic video play for video case
  $scope.showTip = function(step, event) {
    if(step.stepType === 'Season' && $scope.combinedRecipe.canAddSeasoningProfile) {
      $ionicPopover.fromTemplateUrl('main/templates/seasoning-profile-selector.html', 
        {scope: $scope}).then(function(popover) {
        $scope.popover = popover;
        $scope.popover.show(event);
      });
    } else if(step.hasTip || step.stepTips.length > 1) {
      $scope.stepTipStep = step;
      $scope.selectedTipArr = Array($scope.stepTipStep.stepTips.length).fill(false);
      $scope.selectedTipArr[0] = true;
      $scope.displayStepTip = $scope.stepTipStep.stepTips[0];
      $ionicPopover.fromTemplateUrl('main/templates/step-tip-popover.html', 
        {scope: $scope}).then(function(popover) {
        $scope.popover = popover;
        $scope.popover.show(event);
      });
    } else if(step.hasVideo) {
      $scope.autoplayURL = step.stepTips[0].videoURL + "&autoplay=1&rel=0";
      $scope.modal = $ionicModal.fromTemplateUrl('main/templates/video-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }
  };

  $scope.closeModal = function() {
    console.log("close modal");
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.$on('$destroy', function() {
    if($scope.popover) {
      $scope.popover.remove();
    }
  });

  $scope.$on('modal.hidden', function() {
    $scope.modal.remove();
  });

  $scope.$on("test", function(event, data) {
    console.log("emit test: ", data);
  });

  /*$scope.$on('modal.removed', function() {
    $scope.modal.remove();
  });*/

  $scope.toggleMainVideo = function(index) {
    //if false clicked, to true, and true to false
    if(!$scope.mainVideoUrlIndicators[index]) {
      $scope.mainVideoUrlIndicators.fill(false);
      $scope.mainVideoUrlIndicators[index] = true;
      $scope.playingVideoURL = $scope.combinedRecipe.mainVideoURLs[index];
    }
  };

  $scope.getMainVideoDotClass = function(index) {
    if($scope.mainVideoUrlIndicators[index]) {
      return 'ion-ios-circle-filled';
    } else {
      return 'ion-ios-circle-outline';
    }
  };

  $scope.selectStepTip = function(index) {
    $scope.selectedTipArr.fill(false);
    $scope.selectedTipArr[index] = true;
    $scope.displayStepTip = $scope.stepTipStep.stepTips[index];
    console.log($scope.displayStepTip);
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
    if($scope.displayStepTip.videoURL && $scope.displayStepTip.videoURL !== "") {
      return true;
    } else {
       return false;
    }
  };

  $scope.getSeasoningParts = function(profile) {
    return profile.spices.join(', ');
  };

  $scope.seasoningProfilePopup = function(event) {
    $ionicPopover.fromTemplateUrl('main/templates/seasoning-profile-selector.html', 
        {scope: $scope}).then(function(popover) {
        $scope.popover = popover;
        $scope.popover.show(event);
    });
  };

  $scope.changeSeasoningProfile = function(profile) {
    if($scope.popover) {
      setTimeout(function() {$scope.popover.remove()}, 200);
    }
    $scope.seasoningProfile = profile;
    for (var i = $scope.combinedRecipe.stepList.length - 1; i >= 0; i--) {
      if($scope.combinedRecipe.stepList[i].stepType === 'Season') {
        SeasoningProfileTextService.addSeasoning($scope.combinedRecipe.stepList[i], $scope.seasoningProfile);
      }
    }
  };

  $scope.navigateBack = function() {
    //need to get timesclicked mechanism going here
    console.log("numberback: ", $scope.numberBackToRecipeSelection);
    for (var i = $scope.alaCarteSelectedArr.length - 1; i >= 0; i--) {
      $scope.alaCarteSelectedArr.fill(false);
    }
    $ionicHistory.goBack($scope.numberBackToRecipeSelection);
  };
  $scope.resetEverything = function() {
    $ionicHistory.clearCache().then(function() {
      $state.go('main.cook');
    }, function() {
      //error
      console.log('error: failure to clear $ionicHistory clearCache');
    });
  };

  $scope.categoryNeedsOilOrButter = function() {
    if($scope.combinedRecipe.recipeCategory) {
      switch($scope.combinedRecipe.recipeCategory) {
        case 'Scramble':
        case 'Roast':
        case 'Pasta':
        case 'Hash':
        case 'Rice':
        case 'Quinoa':
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
            return true;
          default:
            break;
        }
      }
      return false;
    }
  };
}]);
