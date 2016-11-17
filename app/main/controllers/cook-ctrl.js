'use strict';
angular.module('main')
.controller('CookCtrl', ['$rootScope', '$scope', '$ionicSlideBoxDelegate', 'IngredientService', '$ionicScrollDelegate', '$ionicPopup', '$state', '$stateParams', '$ionicHistory', '$ionicLoading', '$ionicPlatform', 'ErrorService', 'EXIT_POPUP', 'INPUTCATEGORIES', function ($rootScope, $scope, $ionicSlideBoxDelegate, IngredientService, $ionicScrollDelegate, $ionicPopup, $state, $stateParams, $ionicHistory, $ionicLoading, $ionicPlatform, ErrorService, EXIT_POPUP, INPUTCATEGORIES) {

  function alphabeticalCmp(a, b) {
    if(a.name.standardForm < b.name.standardForm) {
      return -1;
    } else if(a.name.standardForm > b.name.standardForm) {
      return 1;
    } else {
      return 0;
    }
  }

  var deregisterBackAction = $ionicPlatform.registerBackButtonAction(function() {
    $ionicLoading.hide();
    var showExitConfirm = true;
    if($scope.invalidPopup && $scope.invalidPopup.pending) {
      $scope.invalidPopup.pending = false;
      showExitConfirm = false;
      $scope.invalidPopup.close();
    }
    if($scope.resetPopup && $scope.resetPopup.pending) {
      $scope.resetPopup.pending = false;
      showExitConfirm = false;
      $scope.resetPopup.close();
    }
    if(showExitConfirm) {
      $ionicPopup.confirm({
        title: EXIT_POPUP.TITLE,
        text: EXIT_POPUP.TEXT
      }).then(function(res) {
        if(res) {
          ionic.Platform.exitApp();
        }
      });
    }
  }, 501);

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    deregisterBackAction();
  });

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  //catch resize event
  ionic.on('resize', function() {
    $rootScope.redrawSlides = true;
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    if($scope.slider) {
      if($rootScope.redrawSlides) {
        //Could stand to refactor this out into some sort of service...
        //Would also be to see if listener for 'resize' could be put out of
        //controller as well
        for (var i = $scope.slider.slides.length - 1; i >= 0; i--) {
          var offset = $scope.slider.slides[i].swiperSlideSize * i;
          $scope.slider.slides[i].swiperSlideOffset = offset;
          var translate3d = "translate3d(" + "-" + offset +"px,0px,0px)";
          $scope.slider.slides[i].style.transform = translate3d;
          if(i === $scope.slider.activeIndex) {
            $scope.slider.slides[i].style.opacity = "1";
          } else {
            $scope.slider.slides[i].style.opacity = "0";
          }
        }
        $rootScope.redrawSlides = false;
      }
    }
  });

  $scope.$on('$ionicView.enter', function(event, data){
    if($stateParams.fromError) {
      ErrorService.toggleIsErrorAlready();
      $scope.clearIngredients();
    }
  });

  IngredientService.getIngredientsForSelection().then(function(response){
    $scope.ingredientCategories = response.data;
    $scope.inputCategoryArray = [];
    //set first form of all ingredients to selected
    for(var category in $scope.ingredientCategories) {
      $scope.inputCategoryArray.push(category);
      var subCategories = $scope.ingredientCategories[category];
      for(var subCategory in subCategories) {
        var ingredients = subCategories[subCategory];
        ingredients.sort(alphabeticalCmp);
        for (var i = ingredients.length - 1; i >= 0; i--) {
          //select form
          ingredients[i].ingredientForms[0].isSelected = true;
        }
      }
    }
    setTimeout(function() {
      $ionicLoading.hide();
    }, 500);
  }, function(response){
    ErrorService.showErrorAlert();
  });

  $scope.data = {};

  $scope.logIngredient = function() {
    
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
    /*if($scope.slider) {
      $scope.slider.update();
    }*/
  };

  $scope.isError = function() {
    return ErrorService.isErrorAlready;
  };

  $scope.showSubCategoryName = function(name) {
    return name !== INPUTCATEGORIES.NOSUBCATEGORY;
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
    speed: 300,
    paginationClickable: true,
    freeMode: false,
    shortSwipes: false,
    spaceBetween: 10,
    scrollbarDraggable: true,
    scrollbarHide: false,
    longSwipesRatio: 0.2,
    longSwipesMs: 50,
    onlyExternal: true,
    onTouchMove: function(swiper, event){
      if(swiper.isEnd) {
        $scope.toRecipeSelection();
      } else {
        swiper.slideNext();
      }
    },
    onTouchMoveOpposite: function(swiper, event){
      swiper.slidePrev();
    },
    onSetTranslate: function(swiper, translate) {

    }
  };

  $scope.slideHasChanged = function(index) {
    /*if($scope.slider) {
      $scope.slider.update();
    }*/
  };

  $scope.slidePrev = function() {
    if($scope.slider) {
      $scope.slider.slidePrev();
      setTimeout(function() {
        $ionicScrollDelegate.scrollTop();
      }, 500);
    }
  };

  $scope.slideNext = function() {
    if($scope.slider) {
      $scope.slider.slideNext();
      setTimeout(function() {
        $ionicScrollDelegate.scrollTop();
      }, 500);
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
      setTimeout(function() {
        $ionicScrollDelegate.scrollTop();
      }, 500);
    }
  };

  $scope.toRecipeSelection = function() {
    var selectedIngredients = [];
    for(var key in $scope.ingredientCategories){
      var subCategories = angular.copy($scope.ingredientCategories[key]);
      for(var subCategory in subCategories) {
        var ingredients = subCategories[subCategory];
        for (var i = ingredients.length - 1; i >= 0; i--) {
          var ingredient = ingredients[i];
          if(ingredient.isSelected){
            //trim unselected forms, then test forms for emptiness
            //Add check for 'any' here
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
    }
    if(selectedIngredients.length > 0){
      //go to next controller - but do we want to query for recipes here or there? Also, how are params accessed by the coming state?
      $state.go('main.cookRecipeSelection', {selectedIngredients: selectedIngredients});
    } else {
      $scope.showInvalidPopup();
    }
  };

  $scope.showInvalidPopup = function() {
    $scope.invalidPopup = $ionicPopup.alert({
      title: 'Surely You Have Something?',
      template: '<p class="no-ingredient-popup">You need to select at least one ingredient</p>'
    });
    $scope.invalidPopup.pending = true;
    $scope.invalidPopup.then(function(res) {
      $scope.goToSlide(0);
      $scope.invalidPopup.pending = false;
    });
  };

  $scope.resetIngredientSelection = function() {
    $scope.resetPopup = $ionicPopup.confirm({
      title: 'Reset Ingredients?',
      template: 'Do you want to reset your selection?',
      cssClass: 'popup-alerts',
      okText: 'Yes',
      cancelText: 'No'
    });
    $scope.resetPopup.pending = true;
    $scope.resetPopup.then(function(res) {
      $scope.resetPopup.pending = false;
      if(res) {
        $scope.clearIngredients();
      }
    });
  };

  $scope.clearIngredients = function() {
    for(var key in $scope.ingredientCategories) {
      for(var subCat in $scope.ingredientCategories[key]) {
        for (var i = $scope.ingredientCategories[key][subCat].length - 1; i >= 0; i--) {
          $scope.ingredientCategories[key][subCat][i].isSelected = false;
          for (var j = $scope.ingredientCategories[key][subCat][i].ingredientForms.length - 1; j >= 0; j--) {
            if(j > 0) {
              $scope.ingredientCategories[key][subCat][i].ingredientForms[j].isSelected = false;
            }
          }
        }
      }
    }
    $scope.goToSlide(0);
  };

  $scope.canHaveForms = function(ingredient) {
    if(ingredient.isSelected && ingredient.ingredientForms.length > 1) {
      var curInputCategory = $scope.getNavBarInputCategory();
      switch(curInputCategory) {
        case 'Vegetables':
        case 'Starches':
          return false;

        case 'Protein':
          if(ingredient.name.standardForm === 'Chicken') {
            return false;
          }
          return true;

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
        setTimeout(function() {
          $ionicScrollDelegate.scrollTop();
        }, 500);
      } else {
        $scope.toRecipeSelection();
      }
    }
  };

  $scope.swipeRight = function() {
    if($scope.slider) {
      $scope.slider.slidePrev();
      setTimeout(function() {
        $ionicScrollDelegate.scrollTop();
      }, 500);
    }
  };

  $scope.getFormCheckShape = function() {
    if(ionic.Platform.isAndroid()) {
      return 'checkbox-square';
    } else {
      //assumes Apple
      return 'checkbox-circle';
    }
  };
}]);
