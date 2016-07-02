'use strict';
angular.module('main')
.controller('GlossaryCollectionPageCtrl', ['$scope', '$stateParams', 'GlossaryService', function ($scope, $stateParams, GlossaryService) {
  $scope.collection = $stateParams.collection;

  console.log("params", $stateParams);

  GlossaryService.getGlossarysForCollection($scope.collection._id).then(function(items) {
    $scope.items = items.data;
  }, function(response) {
    console.log("Server Error: ", response);
  });
}]);
