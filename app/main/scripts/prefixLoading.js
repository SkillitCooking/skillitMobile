'use strict';
angular.module('main')
.run(function(RecipeNameConstructionService) {
  RecipeNameConstructionService.loadPrefixes();
});