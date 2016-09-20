'use strict';
angular.module('main')
.directive('loginDirective', ['$ionicAuth', '$ionicUser', '$ionicPopup', 'LOGIN', function ($ionicAuth, $ionicUser, $ionicPopup, LOGIN) {
  return {
    templateUrl: 'main/templates/login-directive.html',
    restrict: 'E',
    scope: {},
    link: function (scope, element, attrs) {
      scope.hasErrors = false;

      scope.signIn = function() {
        //if success, want to let parent know - either broadcast or $emit
        //also, want to make server call to set current Token for User
        //if failure, then display error messages
        var details = {'email': scope.email, 'password': scope.password};
        //broadcast/emit to get parent to show appropriate loading screen
        $ionicAuth.login(LOGIN.BASIC, details).then(function(result) {
          //broadcast/emit event to parent here to get parent to stop showing loading screen, setup for proper display/behavior
          //also, appropriate server call
          console.log('success email sign in', result);
        }, function(err) {
          //display error message via a popup - either not recognized email or invalid password - play around with the evocation of these
          //to then get what we're properly looking for
          console.log('error email sign in', err);
        });
      };

      scope.signUp = function() {
        //if success, then login; want to let parent know that successful login has occured -either $broadcast or $emit
        //also, want to make server call to create User and set current Token for User
        //if failure, then error messages
        var details = {'email': scope.email, 'password': scope.password};
        //broadcast/emit event here to get parent to show loading screen
        $ionicAuth.signup(details).then(function(res) {
          //sign in immediately
          console.log('success email sign up', res);
          $ionicAuth.login(LOGIN.BASIC, details).then(function(result) {
            //broadcast/emit event to parent here to get parent to stop showing loading screen, setup for proper display/behavior, show appropriate popover
            //also, appropriate server call
            console.log('success email sign in after up', result);
          }, function(err) {
            //handle login errors - what are they? play around with them
            console.log('error email sign in after up', err);
          });
        }, function(err) {
          //handle sign up errors
          var errors = [];
          for (var i = err.details.length - 1; i >= 0; i--) {
            switch(err.details[i]) {
              case LOGIN.EMAIL_CONFLICT:
                errors.push(LOGIN.EMAIL_CONFLICT_MESSAGE);
                break;
              case LOGIN.PASSWORD_REQUIRED:
                errors.push(LOGIN.PASSWORD_REQUIRED_MESSAGE);
                break;
              case LOGIN.EMAIL_REQUIRED:
                errors.push(LOGIN.EMAIL_REQUIRED_MESSAGE);
                break;
              case LOGIN.USERNAME_CONFLICT:
                errors.push(LOGIN.USERNAME_CONFLICT_MESSAGE);
                break;
              case LOGIN.INVALID_EMAIL:
                errors.push(LOGIN.INVALID_EMAIL_MESSAGE);
                break;
              default:
                console.log('Unknown sign up error code: ', err.details[i]);
                break;
            }
            $ionicPopup.show({
              template: '<p ng-repeat="err in errors">{{err}}</p>',
              title: 'Try Again!',
              subTitle: 'Sign Up Error(s):',
              scope: scope,
              buttons: [
                {text: 'OK'}
              ]
            });
          }
        });
      };

      scope.signInFacebook = function() {
        //if success, want to let parent know - either $broadcast or $emit
        //also, want to make server call to possibly create User and set current Token for User
        //if failure, then error messages
        
        //loading screen needed? Especially when going to in app browser?
        $ionicAuth.login(LOGIN.FACEBOOK).then(function(result) {
          //broadcast/emit to parent to set off appropriate behaviors
          //result will carry whether the login created a new user or not
          //appropriate server call, in part based on above result
          alert('successful faceboo');
          console.log('success facebook sign in', result);
        }, function(err) {
          //what types of errors can occur here?
          alert('error facebook');
          console.log('error facebook sign in', err);
        });
      };

      scope.signInGoogle = function() {
        //if success, want to let parent know - either $broadcast or $emit
        //also, want to make server call to possibly create User and set current Token for User
        //if failure, then error messages
        
        //loading screen needed? Especially when going to in app browser?
        $ionicAuth.login(LOGIN.GOOGLE).then(function(result) {
          //broadcast/emit to parent to set off appropriate behaviors
          //result will carry whether the login created a new user or not
          //appropriate server call, in part based on above result
          console.log('success google sign in', result);
          alert('success google');
        }, function(err) {
          //what types of errors can occur here?
          alert('error google');
          console.log('err google sign in', err);
        });
      };

      scope.isSignInDisabled = function() {
        if(!scope.email || !LOGIN.EMAIL_REGEX.test(scope.email)) {
          return true;
        }
        if(!scope.password || scope.password.length < LOGIN.MIN_PASSWORD_LENGTH) {
          return true;
        }
        return false;
      };

      scope.isSignUpDisabled = function() {
        if(!scope.email || !LOGIN.EMAIL_REGEX.test(scope.email)) {
          return true;
        }
        if(!scope.password || scope.password.length < LOGIN.MIN_PASSWORD_LENGTH) {
          return true;
        }
        if(!scope.passwordConfirm || scope.passwordConfirm !== scope.password) {
          return true;
        }
        return false;
      };
    }
  };
}]);
