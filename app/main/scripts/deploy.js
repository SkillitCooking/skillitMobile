'use strict';
angular.module('main')
//check for hot updates
.run(function($ionicPopup, $ionicDeploy, Config) {
  $ionicDeploy.channel = Config.ENV.CHANNEL;
  $ionicDeploy.check().then(function(snapshotAvailable) {
    if(snapshotAvailable) {
      $ionicDeploy.download().then(function() {
        //check for current snapshot, delete ones that aren't it
        $ionicDeploy.info().then(function(curSnapShot) {
          $ionicDeploy.getSnapshots().then(function(snapshots) {
            for (var i = snapshots.length - 1; i >= 0; i--) {
              if(snapshots[i] !== curSnapShot.deploy_uuid) {
                $ionicDeploy.deleteSnapshot(snapshots[i]);
              }
            }
          });
        });
        $ionicDeploy.extract().then(function() {
          $ionicPopup.show({
            title: 'Update Available!',
            template: 'We just fetched an update - would you like to restart Skillit to use the new features?',
            buttons: [
              {text: 'No Thanks'},
              {
                text: 'Restart',
                onTap: function(e) {
                  $ionicDeploy.load();
                }
              }
            ]
          });
        });
      });
    }
  });
});