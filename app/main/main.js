'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'restangular',
  'ionic.cloud'
  // TODO: load other modules selected during generation
])
.constant('_', window._)
.config(function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    'core': {
      'app_id': 'e5243594'
    }
  });
})
.config(function ($stateProvider, $urlRouterProvider, RestangularProvider, $provide, Config) {
  //exception handler
  $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function($delegate, $injector){
    return function(exception, cause) {
      var ErrorService = $injector.get('ErrorService');
      var stackTrace = exception.stack ? exception.stack : "no stack trace found";
      var errInfo = {
        message: 'EXCEPTION: ' + exception.message,
        name: exception.name,
        cause: cause,
        stackTrace: stackTrace
      };
      ErrorService.logError(errInfo);
      $delegate(exception, cause);
      ErrorService.showErrorAlert();
    };
  }]);
  RestangularProvider.setBaseUrl(Config.ENV.SERVER_URL);

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('main/cook');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/tabs.html'
    })
      .state('main.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'main/templates/account-home.html',
            controller: 'AccountHomeCtrl as ctrl'
          }
        }
      })
      .state('main.cookPresentFavoriteRecipe', {
        url: '/account/recipePresent',
        views: {
          'tab-account': {
            templateUrl: 'main/templates/cook-present.html',
            controller: 'CookPresentCtrl as ctrl'
          }
        },
        params: {
          recipeIds: null,
          selectedIngredientNames: null,
          selectedIngredientIds: null,
          alaCarteRecipes: null,
          alaCarteSelectedArr: null,
          currentSeasoningProfile: null,
          sidesAdded: false,
          ingredientsChanged: false,
          numberBackToRecipeSelection: null,
          cameFromHome: false,
          cameFromRecipes: false,
          isFavoriteRecipe: true,
          loadAlaCarte: true
        }
      })
      .state('main.cookAddSideFavorite', {
        cache: false,
        url: '/account/recipePresent/addSide',
        views: {
          'tab-account': {
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
          selectedIngredientIds: null,
          numberBackToRecipeSelection: null,
          isFavoriteRecipe: true
        }
      })
      .state('main.editBYOIngredientsFavorite', {
        cache: false,
        url: '/account/recipePresent/editIngredients',
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
          selectedIngredientIds: null,
          numberBackToRecipeSelection: null,
          BYOIngredientTypes: null,
          BYOName: null,
          cameFromRecipes: false,
          cameFromHome: false,
          isFavoriteRecipe: true
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
        },
        params: {
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
          selectedIngredientIds: null,
          alaCarteRecipes: null,
          alaCarteSelectedArr: null,
          currentSeasoningProfile: null,
          sidesAdded: false,
          ingredientsChanged: false,
          numberBackToRecipeSelection: null,
          cameFromHome: false,
          cameFromRecipes: false,
          isFavoriteRecipe: false,
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
          selectedIngredientIds: null,
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
          selectedIngredientIds: null,
          numberBackToRecipeSelection: null,
          BYOIngredientTypes: null,
          BYOName: null,
          cameFromRecipes: false
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
          selectedIngredientIds: null,
          alaCarteRecipes: null,
          alaCarteSelectedArr: null,
          currentSeasoningProfile: null,
          sidesAdded: false,
          ingredientsChanged: false,
          numberBackToRecipeSelection: null,
          cameFromHome: false,
          cameFromRecipes: true,
          cameFromRecipeCollection: false,
          isFavoriteRecipe: false,
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
          selectedIngredientIds: null,
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
          selectedIngredientIds: null,
          numberBackToRecipeSelection: null,
          BYOIngredientTypes: null,
          BYOName: null,
          cameFromRecipes: true,
          loadAlaCarte: false
        }
      })
      .state('main.chapters', {
        url: '/chapters',
        views: {
          'tab-learn2': {
            templateUrl: 'main/templates/chapters.html',
            controller: 'ChaptersCtrl as ctrl'
          }
        }
      })
      .state('main.chapterPage', {
        url: '/chapterPage',
        views: {
          'tab-learn2': {
            templateUrl: 'main/templates/chapter-page.html',
            controller: 'ChapterPageCtrl as ctrl'
          }
        },
        params: {
          chapter: null,
          chapters: null,
          index: null
        }
      })
      .state('main.articlePage', {
        url: '/articlePage',
        views: {
          'tab-learn2': {
            templateUrl: 'main/templates/article-page.html',
            controller: 'ArticlePageCtrl'
          }
        },
        params: {
          articleId: null,
          chapters: null,
          currentChapterIndex: null,
          lessons: null,
          currentLessonIndex: null
        }
      })
      .state('main.itemsPage', {
        url: '/itemsPage',
        views: {
          'tab-learn2': {
            templateUrl: 'main/templates/items-page.html',
            controller: 'ItemsPageCtrl as ctrl'
          }
        },
        params: {
          lesson: null,
          chapters: null,
          currentChapterIndex: null,
          lessons: null,
          currentLessonIndex: null
        }
      });
});