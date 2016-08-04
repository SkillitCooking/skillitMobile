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
  $urlRouterProvider.otherwise('/main/home');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/tabs.html'
    })
      //base screen of flow for cook tab
      .state('main.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'main/templates/home.html',
            controller: 'HomeCtrl as ctrl'
          }
        }
      })
      .state('main.cookPresentHome', {
        url: '/home/recipePresent',
        views: {
          'tab-home': {
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
          cameFromHome: true,
          cameFromRecipes: false,
          loadAlaCarte: true
        }
      })
      .state('main.cookAddSideHome', {
        cache: false,
        url: '/home/recipePresent/addSide',
        views: {
          'tab-home': {
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
          numberBackToRecipeSelection: null,
          cameFromHome: true
        }
      })
      .state('main.editBYOIngredientsHome', {
        cache: false,
        url: '/home/recipePresent/editIngredients',
        views: {
          'tab-home': {
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
          BYOName: null,
          cameFromRecipes: false,
          cameFromHome: true
        }
      })
      .state('main.cook', {
        url: '/cook',
        views: {
          'tab-cook': {
            templateUrl: 'main/templates/cook.html',
            controller: 'CookCtrl as ctrl'
          }
        },
        params: {
          clearHistory: false,
          fromError: false
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
          cameFromHome: false,
          cameFromRecipes: false,
          loadAlaCarte: false
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
        url: '/cook/recipePresent/editIngredients',
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
          BYOName: null,
          cameFromRecipes: false
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
      .state('main.tipsCollection', {
        url: '/tips/collection',
        views: {
          'tab-tips': {
            templateUrl: 'main/templates/tip-collection-page.html',
            controller: 'TipCollectionPageCtrl as ctrl'
          }
        },
        params: {
          collection: null
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
      .state('main.recipesCollection', {
        url: '/recipes/collection',
        views: {
          'tab-recipes': {
            templateUrl: 'main/templates/recipe-collection-page.html',
            controller: 'RecipeCollectionPageCtrl as ctrl'
          }
        },
        params: {
          collection: null
        }
      })
      .state('main.cookPresentRecipes', {
        url: '/recipes/recipePresent',
        views: {
          'tab-recipes': {
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
          cameFromHome: false,
          cameFromRecipes: true,
          cameFromRecipeCollection: false,
          loadAlaCarte: true
        }
      })
      .state('main.cookAddSideRecipes', {
        cache: false,
        url: '/recipes/recipePresent/addSide',
        views: {
          'tab-recipes': {
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
          numberBackToRecipeSelection: null,
          cameFromRecipes: true,
          cameFromRecipeCollection: false
        }
      })
      .state('main.editBYOIngredientsRecipes', {
        cache: false,
        url: '/recipes/recipePresent/editIngredients',
        views: {
          'tab-recipes': {
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
          BYOName: null,
          cameFromRecipes: true,
          loadAlaCarte: false
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
      .state('main.glossaryCollection', {
        url: '/learn/glossary/collection',
        views: {
          'tab-learn': {
            templateUrl: 'main/templates/glossary-collection-page.html',
            controller: 'GlossaryCollectionPageCtrl as ctrl'
          }
        },
        params: {
          collection: null
        }
      })
      .state('main.trainingVideoCollection', {
        url: '/learn/trainingVideo/collection',
        views: {
          'tab-learn': {
            templateUrl: 'main/templates/training-video-collection-page.html',
            controller: 'TrainingVideoCollectionPageCtrl as ctrl'
          }
        },
        params: {
          collection: null
        }
      })
      .state('main.howToShopCollection', {
        url: '/learn/howToShop/collection',
        views: {
          'tab-learn': {
            templateUrl: 'main/templates/how-to-shop-collection-page.html',
            controller: 'HowToShopCollectionPageCtrl as ctrl'
          }
        },
        params: {
          collection: null
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
