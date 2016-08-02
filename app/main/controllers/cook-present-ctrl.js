'use strict';
angular.module('main')
.controller('CookPresentCtrl', ['_', '$scope', '$stateParams', '$state', 'RecipeService', 'SeasoningProfileService', 'RecipeInstantiationService', 'StepCombinationService', 'SeasoningProfileTextService', '$ionicPopover', '$ionicModal', '$ionicHistory', '$ionicNavBarDelegate', '$ionicTabsDelegate', '$ionicLoading', '$ionicPopup', 'ErrorService', function (_, $scope, $stateParams, $state, RecipeService, SeasoningProfileService, RecipeInstantiationService, StepCombinationService, SeasoningProfileTextService, $ionicPopover, $ionicModal, $ionicHistory, $ionicNavBarDelegate, $ionicTabsDelegate, $ionicLoading, $ionicPopup, ErrorService) {

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

  function getIngredientsForRecipes(recipes) {
    var ingredientsForRecipes = [];
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
        ingredientsForRecipe.ingredients = ingredientsForRecipe.ingredients.concat(concatIngredients);
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

  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(event, data) {
    $ionicNavBarDelegate.showBackButton(false);
  });

  $scope.numberBackToRecipeSelection = $stateParams.numberBackToRecipeSelection;
  $scope.cameFromHome = $stateParams.cameFromHome;
  $scope.cameFromRecipes = $stateParams.cameFromRecipes;
  $scope.cameFromRecipeCollection = $stateParams.cameFromRecipeCollection;
  console.log("came from recipe collection", $stateParams.cameFromRecipeCollection);

  if($stateParams.sidesAdded || $stateParams.ingredientsChanged) {
    $scope.numberBackToRecipeSelection -= 2;
  }

  if(!$scope.numberBackToRecipeSelection) {
    $scope.numberBackToRecipeSelection = -1;
  }
  $scope.recipeIds = $stateParams.recipeIds;
  if($stateParams.loadAlaCarte) {
    RecipeService.getRecipesOfType('AlaCarte').then(function(recipes) {
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
  var wrappedRecipeIds = {
    recipeIds: $scope.recipeIds
  };
  RecipeService.getRecipesWithIds(wrappedRecipeIds).then(function(response) {
    var recipes = response.data;
    RecipeInstantiationService.cullIngredients(recipes, $scope.selectedIngredientNames);
    var BYORecipe = _.find(recipes, function(recipe) {
      return recipe.recipeType === 'BYO';
    });
    if(BYORecipe) {
      $scope.BYOIngredientTypes = BYORecipe.ingredientList.ingredientTypes;
      $scope.BYOName = BYORecipe.name;
    }
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
      if(!$scope.selectedIngredientNames) {
        $scope.selectedIngredientNames = [];
        console.log("recipe", $scope.combinedRecipe);
        for (var i = $scope.combinedRecipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
          for (var j = $scope.combinedRecipe.ingredientList.ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
            $scope.selectedIngredientNames.push($scope.combinedRecipe.ingredientList.ingredientTypes[i].ingredients[j].name);
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

  $scope.fromCookTab = function() {
    return !$scope.cameFromHome && !$scope.cameFromRecipes && !$scope.cameFromRecipeCollection;
  };

  $scope.isSingleStep = function(step) {
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
  };

  $scope.getAddSideText = function() {
    if($scope.sidesExist) {
      return 'Change Sides';
    } else {
      return 'Add a Side Dish';
    }
  };

  $scope.addSide = function() {
    if($scope.cameFromHome) {
      $state.go('main.cookAddSideHome', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
    } else if($scope.cameFromRecipes) {
      $state.go('main.cookAddSideRecipes', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
    } else if($scope.cameFromRecipeCollection) {
      $state.go('main.cookAddSideRecipes', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection, cameFromRecipes: false, cameFromRecipeCollection: true});
    } else {
      $state.go('main.cookAddSide', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection});
    }
  };

  $scope.editBYOIngredients = function() {
    if($scope.cameFromRecipes) {
      $state.go('main.editBYOIngredientsRecipes', {
        alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection, BYOIngredientTypes: $scope.BYOIngredientTypes, BYOName: $scope.BYOName
      });
    } else {
      $state.go('main.editBYOIngredients', {alaCarteRecipes: $scope.alaCarteRecipes, previousRecipeIds: $scope.recipeIds, currentSeasoningProfile: $scope.seasoningProfile, alaCarteSelectedArr: $scope.alaCarteSelectedArr, selectedIngredientNames: $scope.selectedIngredientNames, numberBackToRecipeSelection: $scope.numberBackToRecipeSelection, BYOIngredientTypes: $scope.BYOIngredientTypes, BYOName: $scope.BYOName});
    }
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

  $scope.incrementMainVideo = function() {
    //indexOf true
    var curIndex = $scope.mainVideoUrlIndicators.indexOf(true);
    if(curIndex < $scope.mainVideoUrlIndicators.length - 1) {
      $scope.mainVideoUrlIndicators.fill(false);
      $scope.mainVideoUrlIndicators[curIndex+1] = true;
      $scope.playingVideoURL = $scope.combinedRecipe.mainVideoURLs[curIndex+1];
    }
  };

  $scope.decrementMainVideo = function() {
    //indexOf true
    var curIndex = $scope.mainVideoUrlIndicators.indexOf(true);
    if(curIndex > 0) {
      $scope.mainVideoUrlIndicators.fill(false);
      $scope.mainVideoUrlIndicators[curIndex-1] = true;
      $scope.playingVideoURL = $scope.combinedRecipe.mainVideoURLs[curIndex-1];
    }
  };

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

  $scope.closeSeasoningPopup = function() {
    if($scope.popover) {
      setTimeout(function() {$scope.popover.remove()}, 100);
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
    var resetPopup = $ionicPopup.confirm({
      title: 'Reset Everything?',
      template: 'Do you want to start over and choose new ingredients?'
    });
    resetPopup.then(function(res) {
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
}]);
