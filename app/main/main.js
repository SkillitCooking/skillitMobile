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
  $urlRouterProvider.otherwise('/main/list');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/tabs.html'
    })
      .state('main.list', {
        url: '/list',
        views: {
          'tab-list': {
            templateUrl: 'main/templates/list.html',
            // controller: 'SomeCtrl as ctrl'
          }
        }
      })
      .state('main.listDetail', {
        url: '/list/detail',
        views: {
          'tab-list': {
            templateUrl: 'main/templates/list-detail.html',
            // controller: 'SomeCtrl as ctrl'
          }
        }
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
      .state('main.tips', {
        url: '/tips',
        views: {
          'tab-tips': {
            templateUrl: 'main/templates/tips.html',
            controller: 'TipsCtrl as ctrl'
          }
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
