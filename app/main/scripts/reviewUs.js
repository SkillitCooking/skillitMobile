'use strict';
angular.module('main')
.run(['$ionicPlatform', '$specialOffer', '$window', function($ionicPlatform, $specialOffer, $window) {
    $ionicPlatform.ready(function() {

        var appVersion = '0.2.0';
        var iosId = '1160522059';
        var androidPackageName = 'com.skillit.app';
        $specialOffer.init({
            id           : 'my-special-offer' + appVersion,
            showOnCount  : 5,
            title        : 'Spread the Love!',
            text         : 'Help others discover Skillit!',
            agreeLabel   : 'Rate Us',
            remindLabel  : 'Remind Me Later',
            declineLabel : 'Nah, I\'m Selfish',
            onAgree      : function () {
                // agree
                if ($window.device.platform === 'iOS') {
                    $window.open($specialOffer.appStoreUrl(iosId));
                } else if ($window.device.platform === 'Android') {
                    $window.open($specialOffer.googlePlayUrl(androidPackageName));
                }
                if(typeof $window.ga !== 'undefined') {
                	$window.ga.trackView('UserReview');
                	$window.ga.trackEvent('UserReview', 'Agree');
                }
            },
            onDecline   : function () {
                // declined
                if(typeof $window.ga !== 'undefined') {
                	$window.ga.trackView('UserReview');
                	$window.ga.trackEvent('UserReview', 'Decline');
                }
            },
            onRemindMeLater : function () {
                // will be reminded in 5 more uses
                if(typeof $window.ga !== 'undefined') {
                	$window.ga.trackView('UserReview');
                	$window.ga.trackEvent('UserReview', 'Later');
                }
            },
        });
    });
}]);