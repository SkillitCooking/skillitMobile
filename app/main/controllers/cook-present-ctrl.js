'use strict';
angular.module('main')
.controller('CookPresentCtrl', ['_', '$scope', '$stateParams', 'RecipeService', 'SeasoningProfileService', 'RecipeInstantiationService', 'StepCombinationService', 'SeasoningProfileTextService', '$ionicPopover', '$ionicModal', function (_, $scope, $stateParams, RecipeService, SeasoningProfileService, RecipeInstantiationService, StepCombinationService, SeasoningProfileTextService, $ionicPopover, $ionicModal) {

  /*var player;

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('popup-video');
  }

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);*/

  function getIngredientsForRecipes(recipes) {
    var ingredientsForRecipes = [];
    for (var i = recipes.length - 1; i >= 0; i--) {
      var ingredientsForRecipe = {};
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
    return ingredientsForRecipes;
  }

  $scope.recipeIds = $stateParams.recipeIds;
  $scope.selectedIngredientNames = $stateParams.selectedIngredientNames;
  var wrappedRecipeIds = {
    recipeIds: $scope.recipeIds
  };
  RecipeService.getRecipesWithIds(wrappedRecipeIds).then(function(response) {
    var recipes = response.data;
    RecipeInstantiationService.cullIngredients(recipes, $scope.selectedIngredientNames);
    console.log("preingredient For Recipes: ", angular.copy(recipes));
    $scope.ingredientsForRecipes = getIngredientsForRecipes(recipes);
    RecipeInstantiationService.fillInSteps(recipes);
    RecipeInstantiationService.setBackwardsIsEmptySteps(recipes);
    RecipeInstantiationService.setTheRestIsEmpty(recipes);
    //build the below out later
    $scope.combinedRecipe = StepCombinationService.getCombinedRecipe(recipes);
    if($scope.combinedRecipe) {
      $scope.seasoningProfile = $scope.combinedRecipe.defaultSeasoningProfile;
    }
    console.log("combined recipe: ", $scope.combinedRecipe);
    console.log("ingredientsForRecipes", $scope.ingredientsForRecipes);
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

  function autoPlayVideo(videoURL) {

  }

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
      $scope.autoplayURL = step.stepTips[0].videoURL + "&autoplay=1";
      var autoplayTemplate = '<ion-modal-view>' + 
        '<iframe width="427" height="240" ng-src="{{autoplayURL | sourceTrusted}}" frameborder="0" allowfullscreen></iframe>' +
        '</ion-modal-view>';
      $scope.modal = $ionicModal.fromTemplate(autoplayTemplate, {
        scope: $scope,
        animation: 'slide-in-up'
      });
      $scope.modal.show();
    }
  };

  $scope.$on('$destroy', function() {
    if($scope.popover) {
      $scope.popover.remove();
    }
    if($scope.modal) {
      $scope.modal.remove();
    }
  });

  $scope.$on('modal.hidden', function() {
    $scope.modal.remove();
  });

  /*$scope.$on('modal.removed', function() {
    $scope.modal.remove();
  });*/

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
    $scope.seasoningProfile = profile;
    for (var i = $scope.combinedRecipe.stepList.length - 1; i >= 0; i--) {
      if($scope.combinedRecipe.stepList[i].stepType === 'Season') {
        SeasoningProfileTextService.addSeasoning($scope.combinedRecipe.stepList[i], $scope.seasoningProfile);
      }
    }
  };
}]);
