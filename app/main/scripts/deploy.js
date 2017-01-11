'use strict';
angular.module('main')
//check for hot updates
.run(function($ionicPopup, $ionicDeploy, $ionicLoading, Config, LOADING) {
  $ionicDeploy.channel = Config.ENV.CHANNEL;
  $ionicDeploy.getSnapshots().then(function(snapshots) {
    $ionicDeploy.info().then(function(curSnapShot) {
      for (var i = snapshots.length - 1; i >= 0; i--) {
        if(snapshots[i] !== curSnapShot.deploy_uuid) {
          $ionicDeploy.deleteSnapshot(snapshots[i]);
        }
      }
    });
    $ionicDeploy.check().then(function(snapshotAvailable) {
      if(snapshotAvailable) {
        $ionicLoading.show({
          template: LOADING.TEMPLATE,
          noBackdrop: true
        });
        $ionicDeploy.download().then(function() {
            if(snapshots.length === 0) {
              //then can assume a first time download
              $ionicDeploy.extract().then(function() {
                $ionicLoading.hide();
                $ionicDeploy.load();
              });
            } else {
              $ionicDeploy.extract().then(function() {
                $ionicLoading.hide();
                $ionicDeploy.load();
              });
            }
        });
      } 
    });
  });
});