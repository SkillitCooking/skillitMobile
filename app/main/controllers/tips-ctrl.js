'use strict';
angular.module('main')
.controller('TipsCtrl', ['$scope', '$ionicHistory', '$ionicNavBarDelegate', '$stateParams', '$state', '$ionicTabsDelegate', function ($scope, $ionicHistory, $ionicNavBarDelegate, $stateParams, $state, $ionicTabsDelegate) {

  $scope.$on('$ionicView.enter', function(event, data){
    $ionicNavBarDelegate.showBackButton(true);
  });

  $scope.cameFromHome = $stateParams.cameFromHome;

  $scope.list = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];

  $scope.navigateBack = function() {
    $ionicHistory.clearCache().then(function() {
      $ionicTabsDelegate.select(4);
    }, function(error) {
      console.log("$ionicHistory clearCache error", error);
    });
  };
}]);
