'use strict';
angular.module('main')
.controller('CookCtrl', ['_', '$window', '$rootScope', '$scope', '$persist', '$ionicNavBarDelegate', '$ionicTabsDelegate', '$ionicSlideBoxDelegate', 'AnyFormSelectionService', 'GeneralTextService', 'IngredientService', 'IngredientsUsedService',  '$ionicScrollDelegate', '$ionicModal', '$ionicPopup', '$state', '$stateParams', '$ionicHistory', '$ionicLoading', '$ionicPlatform', '$ionicAuth', '$ionicUser', 'ErrorService', 'EXIT_POPUP', 'INPUTCATEGORIES', 'INGREDIENT_CATEGORIES', 'USER', 'LOGIN', 'LOADING', function (_, $window, $rootScope, $scope, $persist, $ionicNavBarDelegate, $ionicTabsDelegate, $ionicSlideBoxDelegate, AnyFormSelectionService, GeneralTextService, IngredientService, IngredientUsedService, $ionicScrollDelegate, $ionicModal, $ionicPopup, $state, $stateParams, $ionicHistory, $ionicLoading, $ionicPlatform, $ionicAuth, $ionicUser, ErrorService, EXIT_POPUP, INPUTCATEGORIES, INGREDIENT_CATEGORIES, USER, LOGIN, LOADING) {

  $scope.catNames = [];

  function alphabeticalCmp(a, b) {
    if(a.name.standardForm < b.name.standardForm) {
      return -1;
    } else if(a.name.standardForm > b.name.standardForm) {
      return 1;
    } else {
      return 0;
    }
  }

  if(typeof $window.ga !== 'undefined') {
    if($ionicAuth.isAuthenticated()) {
      $window.ga.setUserId($ionicUser.get(USER.ID));
    }
    $window.ga.trackView('IngredientInput');
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
    template: LOADING.DEFAULT_TEMPLATE,
    noBackdrop: true
  });

  //catch resize event
  ionic.on('resize', function() {
    $rootScope.redrawSlides = true;
  });

  var userId, userToken;

  $scope.$on('$ionicView.beforeEnter', function() {
    $persist.set('HAS_SEEN', 'FIRST_OPEN', true);
    if($ionicAuth.isAuthenticated()) {
      userId = $ionicUser.get(USER.ID);
      userToken = $ionicAuth.getToken();
    }
    $ionicTabsDelegate.showBar(true);
    $ionicNavBarDelegate.showBar(true);
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
      $stateParams.fromError = !$stateParams.fromError;
    }
    $scope.slideStartTime = Date.now();
  });

  function categorySortFn(catA, catB) {
    if(catA.name === INGREDIENT_CATEGORIES.VEGETABLES) {
      return -1;
    }
    if(catB.name === INGREDIENT_CATEGORIES.VEGETABLES) {
      return 1;
    }
    if(catA.name === INGREDIENT_CATEGORIES.PROTEIN) {
      return -1;
    }
    if(catB.name === INGREDIENT_CATEGORIES.PROTEIN) {
      return 1;
    }
    if(catA.name === INGREDIENT_CATEGORIES.STARCH) {
      return -1;
    }
    if(catB.name === INGREDIENT_CATEGORIES.STARCH) {
      return 1;
    }
    return 0;
  }

  function hasDisplayForms(ingredient) {
    if(ingredient.ingredientForms.length === 0) {
      return false;
    }
    switch(ingredient.inputCategory) {
      case 'Vegetables':
      case 'Starches':
        return false;

      case 'Protein':
        if(ingredient.name.standardForm === 'Chicken') {
          return false;
        }
        return true;
      default:
        return false;
    }
  }

  function getIngredients() {
    IngredientService.getIngredientsForSelection(userId, userToken).then(function(response){
      /*$scope.response = _.omit(response, ['data']);
      $ionicPopup.show({
        title: 'Debug',
        template: '<pre>{{response | json}}</pre>',
        scope: $scope
      });*/
      var ingredientCategoriesObj = response.data;
      $scope.ingredientCategories = [];
      $scope.inputCategoryArray = [];
      //set first form of all ingredients to selected
      for(var category in ingredientCategoriesObj) {
        var subCategories = ingredientCategoriesObj[category];
        $scope.ingredientCategories.push({
          name: category,
          subCategories: subCategories
        });
        $scope.inputCategoryArray.push(category);
        for(var subCategory in subCategories) {
          var ingredients = subCategories[subCategory];
          ingredients.sort(alphabeticalCmp);
          for (var i = ingredients.length - 1; i >= 0; i--) {
            //select form
            if(!hasDisplayForms(ingredients[i])) {
              ingredients[i].ingredientForms[0].isSelected = true;
            } 
          }
        }
      }
      $scope.ingredientCategories.sort(categorySortFn);
      setTimeout(function() {
        $ionicLoading.hide();
      }, 500);
    }, function(response){
      $scope.response = _.omit(response, ['data']);
      ErrorService.showErrorAlert();
    });
  }

  getIngredients();

  //when dietaryPreferences change, reload
  $scope.$on('dietaryPreferencesChanged', function(event) {
    console.log('right here');
    event.preventDefault();
    $scope.goToSlide(0);
    getIngredients();
  });

  $scope.data = {};

  $scope.logIngredient = function() {
    
  };

  $scope.$watch("data.slider", function(nv, ov) {
    $scope.slider = $scope.data.slider;
  });

  $scope.storeCatName = function(index, name) {
    $scope.catNames[index] = name;
  };

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

  $scope.slidePrev = function() {
    if($scope.slider) {
      if(!$scope.slider.isBeginning) {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.slideStartTime;
          $window.ga.trackTiming('IngredientInput', interval, $scope.catNames[$scope.slider.activeIndex]);
          $scope.slideStartTime = Date.now();
        }
      }
      $scope.slider.slidePrev();
      setTimeout(function() {
        $ionicScrollDelegate.scrollTop();
      }, 500);
    }
  };

  $scope.slideNext = function() {
    if($scope.slider) {
      if(typeof $window.ga !== 'undefined') {
        var interval = Date.now() - $scope.slideStartTime;
        $window.ga.trackTiming('IngredientInput', interval, $scope.catNames[$scope.slider.activeIndex]);
        $scope.slideStartTime = Date.now();
      }
      $scope.slider.slideNext();
      setTimeout(function() {
        $ionicScrollDelegate.scrollTop();
      }, 500);
    }
  };

  $scope.hasMoreSlides = function() {
    if($scope.slider) {
      if($scope.ingredientCategories) {
        return $scope.slider.activeIndex < $scope.ingredientCategories.length - 1;
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

  function getIngredientIds(selectedIngredients) {
    return _.map(selectedIngredients, function(ingredient) {
      return {
        _id: ingredient._id,
        formIds: _.map(ingredient.ingredientForms, '_id')
      };
    });
  }

  $scope.toRecipeSelection = function() {
    if($scope.ingredientCategories) {
      var selectedIngredients = [];
      for(var i = $scope.ingredientCategories.length - 1; i >= 0; i--){
        var subCategories = angular.copy($scope.ingredientCategories[i].subCategories);
        for(var subCategory in subCategories) {
          var ingredients = subCategories[subCategory];
          for (var k = ingredients.length - 1; k >= 0; k--) {
            var ingredient = ingredients[k];
            if(ingredient.isSelected){
              //trim unselected forms, then test forms for emptiness
              if(!_.some(ingredient.ingredientForms, function(form) {
                return form.isSelected;
              })) {
                //then select necessary forms
                AnyFormSelectionService.selectForms(ingredient.ingredientForms);
              }
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
      if(selectedIngredients.length > 0) {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.slideStartTime;
          $window.ga.trackTiming('IngredientInput', interval, $scope.catNames[$scope.slider.activeIndex]);
          var ingredientNamePairs = GeneralTextService.getNamePairs(selectedIngredients);
          for (var l = ingredientNamePairs.length - 1; l >= 0; l--) {
            $window.ga.trackEvent('IngredientPair', ingredientNamePairs[l]);
          }
        }
        //create id/formid array
        var isAnonymous = true;
        if($ionicAuth.isAuthenticated()) {
          isAnonymous = false;
        }
        var ingredientIds = getIngredientIds(selectedIngredients);
        IngredientUsedService.postUsedIngredients({
          ingredientIds: ingredientIds,
          isAnonymous: isAnonymous,
          userId: $ionicUser.get(USER.ID, undefined),
          token: $ionicAuth.getToken(),
          deviceToken: ionic.Platform.device().uuid
        }).then(function(res) {
          //don't need to handle a success either - just logging ish for now
        }, function(response) {
          //don't need to do anything to client-side handle an error - just let the
          //user continue
        });
        //go to next controller - but do we want to query for recipes here or there? Also, how are params accessed by the coming state?
        $state.go('main.cookRecipeSelection', {selectedIngredients: selectedIngredients});
      } else {
        $scope.showInvalidPopup();
      }
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
      title: 'Reset Selection?',
      template: '<p class="no-ingredient-popup">Do you want to clear your ingredients and start over?</p>',
      cssClass: 'popup-alerts',
      okText: 'Yes',
      cancelText: 'No'
    });
    $scope.resetPopup.pending = true;
    $scope.resetPopup.then(function(res) {
      $scope.resetPopup.pending = false;
      if(res) {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.slideStartTime;
          $window.ga.trackTiming('IngredientInput', interval, $scope.catNames[$scope.slider.activeIndex]);
        }
        $scope.clearIngredients();
      }
    });
  };

  $scope.clearIngredients = function() {
    if($scope.ingredientCategories) {
      for(var k = $scope.ingredientCategories.length - 1; k >= 0; k--) {
        for(var subCat in $scope.ingredientCategories[k].subCategories) {
          for (var i = $scope.ingredientCategories[k].subCategories[subCat].length - 1; i >= 0; i--) {
            $scope.ingredientCategories[k].subCategories[subCat][i].isSelected = false;
            for (var j = $scope.ingredientCategories[k].subCategories[subCat][i].ingredientForms.length - 1; j >= 0; j--) {
              if(j > 0) {
                $scope.ingredientCategories[k].subCategories[subCat][i].ingredientForms[j].isSelected = false;
              }
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
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.slideStartTime;
          $window.ga.trackTiming('IngredientInput', interval, $scope.catNames[$scope.slider.activeIndex]);
          $scope.slideStartTime = Date.now();
        }
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
      if(!$scope.slider.isBeginning) {
        if(typeof $window.ga !== 'undefined') {
          var interval = Date.now() - $scope.slideStartTime;
          $window.ga.trackTiming('IngredientInput', interval, $scope.catNames[$scope.slider.activeIndex]);
          $scope.slideStartTime = Date.now();
        }
      }
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

  $scope.ingredientSelected = function(ingredient) {
    if(typeof $window.ga !== 'undefined') {
      var action = 'unchecked';
      if(ingredient.isSelected) {
        action = 'checked';
      }
      $window.ga.trackEvent('IngredientChecked', action, ingredient.name.standardForm);
    }
  };

  $scope.ingredientFormSelected = function(form, ingredient) {
    if(typeof $window.ga !== 'undefined') {
      var action = 'unchecked';
      if(form.isSelected) {
        action = 'unchecked';
      }
      var label = ingredient.name.standardForm + '.' + form.name;
      $window.ga.trackEvent('IngredientFormChecked', action, label);
    }
  }
}]);
