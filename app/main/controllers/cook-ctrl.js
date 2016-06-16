'use strict';
angular.module('main')
.controller('CookCtrl', ['$scope', '$ionicSlideBoxDelegate', 'IngredientService', '$ionicScrollDelegate', '$ionicPopup', '$state', function ($scope, $ionicSlideBoxDelegate, IngredientService, $ionicScrollDelegate, $ionicPopup, $state) {

  function alphabeticalCmp(a, b) {
    if(a.name < b.name) {
      return -1;
    } else if(a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }

  IngredientService.getIngredientsForSelection().then(function(response){
    console.log(response.data);
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
  }, function(response){
    console.log("Server Error: " + response.message);
  });

  $scope.repeatDone = function() {
    $ionicSlideBoxDelegate.update();
  };

  $scope.getWrapClass = function(index) {
    if($ionicSlideBoxDelegate.currentIndex() === index){
      return 'my-wrap-class-active';
    } else {
      return '';
    }
  };

  $scope.slideHasChanged = function(index) {
    console.log(index);
    $ionicScrollDelegate.scrollTop();
  };

  $scope.slidePrev = function() {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.slideNext = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.hasMoreSlides = function() {
    return $ionicSlideBoxDelegate.currentIndex() < Object.keys($scope.ingredientCategories).length - 1;
  };

  $scope.isBeginningSlide = function() {
    return $ionicSlideBoxDelegate.currentIndex() === 0;
  };

  $scope.getNavBarInputCategory = function() {
    var index = $ionicSlideBoxDelegate.currentIndex();
    return $scope.inputCategoryArray[index];
  };

  $scope.goToSlide = function(index) {
    $ionicSlideBoxDelegate.slide(index);
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
      console.log("valid choosing");
      //go to next controller - but do we want to query for recipes here or there? Also, how are params accessed by the coming state?
      $state.go('main.cookRecipeSelection', {selectedIngredients: selectedIngredients});
    } else {
      console.log("invalid choosing");
      $scope.showInvalidPopup();
    }
  };

  $scope.showInvalidPopup = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'You need Ingredients!',
      template: 'Make sure that you select at least one ingredient and form!'
    });
    alertPopup.then(function(res) {
      console.log("alert closed");
    });
  };

  $scope.resetIngredientSelection = function() {
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
  };

  $scope.test = function(ingredients){
    console.log("Ingredients: ", ingredients);
  };
}]);
