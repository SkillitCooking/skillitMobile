'use strict';
angular.module('main')
.controller('CookCtrl', ['$scope', '$ionicSlideBoxDelegate', 'IngredientService', '$ionicScrollDelegate', '$ionicPopup', '$state', '$stateParams', '$ionicHistory', '$ionicNavBarDelegate', '$ionicLoading', 'ErrorService', function ($scope, $ionicSlideBoxDelegate, IngredientService, $ionicScrollDelegate, $ionicPopup, $state, $stateParams, $ionicHistory, $ionicNavBarDelegate, $ionicLoading, ErrorService) {

  function alphabeticalCmp(a, b) {
    if(a.name < b.name) {
      return -1;
    } else if(a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }



  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
    if($stateParams.clearHistory) {
      $ionicHistory.clearHistory();
      $stateParams.clearHistory = false;
    }
  });

  IngredientService.getIngredientsForSelection().then(function(response){
    $scope.ingredientCategories = response.data;
    $scope.inputCategoryArray = [];
    //set first form of all ingredients to selected
    for(var category in $scope.ingredientCategories) {
      $scope.inputCategoryArray.push(category);
      var ingredients = $scope.ingredientCategories[category];
      ingredients.sort(alphabeticalCmp);
      for (var i = ingredients.length - 1; i >= 0; i--) {
        //select form
        ingredients[i].ingredientForms[0].isSelected = true;
      }
    }
    setTimeout(function() {
      $ionicLoading.hide();
    }, 500);
  }, function(response){
    ErrorService.showErrorAlert();
  });

  $scope.data = {};

  $scope.logIngredients = function(ingredients) {
    console.log("ingredients: ", ingredients);
  };

  $scope.$watch("data.slider", function(nv, ov) {
    $scope.slider = $scope.data.slider;
  });

  $scope.notBeginningSlide = function() {
    if($scope.slider) {
      return $scope.slider.activeIndex !== 0;
    }
  };

  $scope.repeatDone = function() {
    if($scope.slider) {
      $scope.slider.update();
    }
  };

  $scope.getWrapClass = function(index) {
    if($scope.slider) {
      if($scope.slider.activeIndex === index){
        return 'my-wrap-class-active';
      } else {
        return '';
      }
    }
  };

  $scope.slideOptions = {
    loop: false,
    effect: 'fade',
    fade: {crossFade: true},
    speed: 500,
    paginationClickable: true,
    freeMode: true,
    spaceBetween: 10,
    onSlideChangeEnd: function(swiper) {
      swiper.update();
    },
    scrollbarDraggable: true,
    scrollbarHide: false
  };

  $scope.slideHasChanged = function(index) {
    if($scope.slider) {
      $scope.slider.update();
    }
  };

  $scope.slidePrev = function() {
    if($scope.slider) {
      $scope.slider.slidePrev();
    }
  };

  $scope.slideNext = function() {
    if($scope.slider) {
      $scope.slider.slideNext();
    }
  };

  $scope.hasMoreSlides = function() {
    if($scope.slider) {
      if($scope.ingredientCategories) {
        return $scope.slider.activeIndex < Object.keys($scope.ingredientCategories).length - 1;
      }
    }
  };

  $scope.isBeginningSlide = function() {
    if($scope.slider) {
      return $scope.slider.activeIndex === 0;
    }
  };

  $scope.getNavBarInputCategory = function() {
    if($scope.slider) {
      if($scope.inputCategoryArray) {
        var index = $scope.slider.activeIndex;
        return $scope.inputCategoryArray[index];
      } else {
        return "";
      }
    }
  };

  $scope.goToSlide = function(index) {
    if($scope.slider) {
      $scope.slider.slideTo(index);
    }
  };

  $scope.toRecipeSelection = function() {
    var selectedIngredients = [];
    for(var key in $scope.ingredientCategories){
      var ingredients = angular.copy($scope.ingredientCategories[key]);
      for (var i = ingredients.length - 1; i >= 0; i--) {
        var ingredient = ingredients[i];
        if(ingredient.isSelected){
          //trim unselected forms, then test forms for emptiness
          for (var j = ingredient.ingredientForms.length - 1; j >= 0; j--) {
            if(!ingredient.ingredientForms[j].isSelected){
              ingredient.ingredientForms.splice(j, 1);
            }
          }
          if(ingredient.ingredientForms.length > 0){
            selectedIngredients.push(ingredient);
          }
        }
      }
    }
    if(selectedIngredients.length > 0){
      //go to next controller - but do we want to query for recipes here or there? Also, how are params accessed by the coming state?
      $state.go('main.cookRecipeSelection', {selectedIngredients: selectedIngredients});
    } else {
      $scope.showInvalidPopup();
    }
  };

  $scope.showInvalidPopup = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Surely You Have Something?',
      template: '<p class="no-ingredient-popup">You need to select at least one ingredient</p>'
    });
    alertPopup.then(function(res) {
      console.log("alert closed");
    });
  };

  $scope.resetIngredientSelection = function() {
    var alertPopup = $ionicPopup.confirm({
      title: 'Reset Ingredients?',
      template: 'Do you want to reset your selection?'
    });
    alertPopup.then(function(res) {
      if(res) {
        for(var key in $scope.ingredientCategories) {
          for (var i = $scope.ingredientCategories[key].length - 1; i >= 0; i--) {
            $scope.ingredientCategories[key][i].isSelected = false;
            for (var j = $scope.ingredientCategories[key][i].ingredientForms.length - 1; j >= 0; j--) {
              if(j > 0) {
                $scope.ingredientCategories[key][i].ingredientForms[j].isSelected = false;
              }
            }
          }
        }
        $scope.goToSlide(0);
      }
    });
  };

  $scope.canHaveForms = function(ingredient) {
    if(ingredient.isSelected && ingredient.ingredientForms.length > 1) {
      var curInputCategory = $scope.getNavBarInputCategory();
      switch(curInputCategory) {
        case 'Vegetables':
        case 'Starches':
          return false;

        case 'Protein':
          return 'true';

        default:
          //error
          //call error api
          ErrorService.logError({
            message: "Cook Controller ERROR: unexpected inputCategory in function 'canHaveForms'",
            inputCategory: curInputCategory 
          });
          ErrorService.showErrorAlert();
          break;
      }
    } else {
      return false;
    }
  };

  $scope.navigateBack = function() {
    $ionicHistory.goBack();
  };

  $scope.swipeLeft = function() {
    if($scope.slider) {
      if($scope.hasMoreSlides()) {
        $scope.slider.slideNext();
      } else {
        $scope.toRecipeSelection();
      }
    }
  };

  $scope.swipeRight = function() {
    if($scope.slider) {
      $scope.slider.slidePrev();
    }
  };

  $scope.test = function(ingredients){
    console.log("Ingredients: ", ingredients);
  };
}]);
