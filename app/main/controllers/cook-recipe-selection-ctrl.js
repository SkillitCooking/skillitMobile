'use strict';
angular.module('main')
.controller('CookRecipeSelectionCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
  $scope.selectedIngredients = $stateParams.selectedIngredients;
}]);
