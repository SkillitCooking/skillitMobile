'use strict';
angular.module('main')
//check for hot updates
.run(function($ionicPopup, $ionicDeploy, Config) {
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
        $ionicDeploy.download().then(function() {
          //check for current snapshot, delete ones that aren't it
            if(snapshots.length === 0) {
              //then can assume a first time download
              $ionicDeploy.extract().then(function() {
                $ionicDeploy.load();
              });
            } else {
              $ionicDeploy.extract().then(function() {
                $ionicDeploy.load();
              });
            }
        });
      } 
    });
  });
});