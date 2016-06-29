'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'restangular'
  // TODO: load other modules selected during generation
])
.constant('_', window._)
.config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
  //Restangular setup
  RestangularProvider.setBaseUrl("http://107.170.199.250:3000/api/");

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/cook');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/tabs.html'
    })
      //base screen of flow for cook tab
      .state('main.cook', {
        url: '/cook',
        views: {
          'tab-cook': {
            templateUrl: 'main/templates/cook.html',
            controller: 'CookCtrl as ctrl'
          }
        }
      })
      .state('main.cookRecipeSelection', {
        url: '/cook/recipeSelection',
        views: {
          'tab-cook': {
            templateUrl: 'main/templates/cook-recipe-selection.html',
            controller: 'CookRecipeSelectionCtrl as ctrl'
          }
        },
        params: {
          selectedIngredients: null
        }
      })
      .state('main.cookPresent', {
        url: '/cook/recipePresent',
        views: {
          'tab-cook': {
            templateUrl: 'main/templates/cook-present.html',
            controller: 'CookPresentCtrl as ctrl'
          }
        },
        params: {
          recipeIds: null,
          selectedIngredientNames: null,
          alaCarteRecipes: null,
          alaCarteSelectedArr: null,
          currentSeasoningProfile: null,
          sidesAdded: false,
          ingredientsChanged: false,
          numberBackToRecipeSelection: null,
          cameFromHome: false
        }
      })
      .state('main.cookAddSide', {
        cache: false,
        url: '/cook/recipePresent/addSide',
        views: {
          'tab-cook': {
            templateUrl: 'main/templates/side-dish-selection.html',
            controller: 'SideDishSelectionCtrl as ctrl'
          }
        },
        params: {
          alaCarteRecipes: null,
          alaCarteSelectedArr: null,
          currentSeasoningProfile: null,
          previousRecipeIds: null,
          selectedIngredientNames: null,
          numberBackToRecipeSelection: null
        }
      })
      .state('main.editBYOIngredients', {
        cache: false,
        url: 'cook/recipePresent/editIngredients',
        views: {
          'tab-cook': {
            templateUrl: 'main/templates/edit-byo-ingredients.html',
            controller: 'EditByoIngredientsCtrl as ctrl'
          }
        },
        params: {
          alaCarteRecipes: null,
          alaCarteSelectedArr: null,
          currentSeasoningProfile: null,
          previousRecipeIds: null,
          selectedIngredientNames: null,
          numberBackToRecipeSelection: null,
          BYOIngredientTypes: null,
          BYOName: null
        }
      })
      .state('main.tips', {
        url: '/tips',
        views: {
          'tab-tips': {
            templateUrl: 'main/templates/tips.html',
            controller: 'TipsCtrl as ctrl'
          }
        },
        params: {
          cameFromHome: false
        }
      })
      .state('main.recipes', {
        url: '/recipes',
        views: {
          'tab-recipes': {
            templateUrl: 'main/templates/recipes.html',
            controller: 'RecipesCtrl as ctrl'
          }
        }
      })
      .state('main.learn', {
        url: '/learn',
        views: {
          'tab-learn': {
            templateUrl: 'main/templates/learn.html',
            controller: 'LearnCtrl as ctrl'
          }
        }
      })
      .state('main.list', {
        url: '/learn/list',
        views: {
          'tab-learn': {
            templateUrl: 'main/templates/list.html',
            controller: 'LearnCtrl as ctrl'
          }
        }
      })
      .state('main.listDetail', {
        url: 'learn/list/detail',
        views: {
          'tab-learn': {
            templateUrl: 'main/templates/list-detail.html',
            controller: 'LearnCtrl as ctrl'
          }
        }
      })
      .state('main.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'main/templates/home.html',
            controller: 'HomeCtrl as ctrl'
          }
        }
      })
      .state('main.debug', {
        url: '/debug',
        views: {
          'tab-debug': {
            templateUrl: 'main/templates/debug.html',
            controller: 'DebugCtrl as ctrl'
          }
        }
      });
});
