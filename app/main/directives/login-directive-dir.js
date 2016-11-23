'use strict';
angular.module('main')
.directive('loginDirective', ['$rootScope', '$ionicAuth', '$ionicUser', '$ionicModal', '$ionicPopup', 'UserService', 'ErrorService', 'LOGIN', 'USER', function ($rootScope, $ionicAuth, $ionicUser, $ionicModal, $ionicPopup, UserService, ErrorService, LOGIN, USER) {
  return {
    templateUrl: 'main/templates/login-directive.html',
    restrict: 'E',
    scope: {
      isWalkthrough: '='
    },
    link: function (scope, element, attrs) {
      scope.hasErrors = false;
      scope.data = {};

      function clearForm() {
        scope.password = "";
        scope.passwordConfirm = "";
      }

      scope.getLoginClasses = function() {
        if(scope.isWalkthrough) {
          return 'login-screen-walkthrough';
        } else {
          return 'login-screen';
        }
      };

      scope.signIn = function() {
        //if success, want to let parent know - either broadcast or $emit
        //also, want to make server call to set current Token for User
        //if failure, then display error messages
        var details = {'email': scope.email, 'password': scope.password};
        //broadcast/emit to get parent to show appropriate loading screen
        scope.$emit('signInStart');
        $ionicAuth.login(LOGIN.BASIC, details).then(function(result) {
          //broadcast/emit event to parent here to get parent to stop showing loading screen, setup for proper display/behavior
          
          UserService.emailLogin({
            email: scope.email,
            token: result.token
          }).then(function(res) {
            $ionicUser.set(USER.ID, res.data._id);
            $ionicUser.save();
            $rootScope.$broadcast('signInStop', true, true);
            clearForm();
            $ionicPopup.alert({
              title: 'Login was successful!',
              template: 'Now let\'s get cooking!'
            });
          }, function(response) {
            clearForm();
            $rootScope.$broadcast('signInStop', true, false);
            $ionicAuth.logout();
            ErrorService.showErrorAlert();
          });
          
        }, function(err) {
          scope.$emit('signInStop', false, false);
          clearForm();
          //display error message via a popup - either not recognized email or invalid password - play around with the evocation of these
          //to then get what we're properly looking for
          $ionicPopup.alert({
            title: 'Please try again',
            template: 'The email and password combination was invalid.'
          });
        });
      };

      scope.signUp = function() {
        //if success, then login; want to let parent know that successful login has occured -either $broadcast or $emit
        //also, want to make server call to create User and set current Token for User
        //if failure, then error messages
        var details = {'email': scope.email, 'password': scope.password};
        //broadcast/emit event here to get parent to show loading screen
        scope.$emit('signInStart');
        $ionicAuth.signup(details).then(function(res) {
          //sign in immediately
          return $ionicAuth.login(LOGIN.BASIC, details).then(function(result) {
            //broadcast/emit event to parent here to get parent to stop showing loading screen, setup for proper display/behavior, show appropriate popover
            UserService.emailSignup({
              email: scope.email,
              token: result.token
            }).then(function(res) {
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Signup Successful!',
               template: 'Now let\'s get cooking!'
              });
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicAuth.logout();
              ErrorService.showErrorAlert();
            });
          }, function(err) {
            $rootScope.$broadcast('signInStop', false, false);
            clearForm();
            //handle login errors - what are they? play around with them
            $ionicPopup.alert({
              title: 'Please try again',
              template: 'The email and password combination was invalid.'
            });
          });
        }, function(err) {
          scope.$emit('signInStop', false, false);
          clearForm();
          //handle sign up errors
          scope.errors = [];
          for (var i = err.details.length - 1; i >= 0; i--) {
            switch(err.details[i]) {
              case LOGIN.EMAIL_CONFLICT:
                scope.errors.push(LOGIN.EMAIL_CONFLICT_MESSAGE);
                break;
              case LOGIN.PASSWORD_REQUIRED:
                scope.errors.push(LOGIN.PASSWORD_REQUIRED_MESSAGE);
                break;
              case LOGIN.EMAIL_REQUIRED:
                scope.errors.push(LOGIN.EMAIL_REQUIRED_MESSAGE);
                break;
              case LOGIN.USERNAME_CONFLICT:
                scope.errors.push(LOGIN.USERNAME_CONFLICT_MESSAGE);
                break;
              case LOGIN.INVALID_EMAIL:
                scope.errors.push(LOGIN.INVALID_EMAIL_MESSAGE);
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
        scope.$emit('signInStart');
        //loading screen needed? Especially when going to in app browser?
        $ionicAuth.login(LOGIN.FACEBOOK).then(function(result) {
          //broadcast/emit to parent to set off appropriate behaviors
          //result will carry whether the login created a new user or not

          //different alert cases - new signup vs. existing user
          if(result.signup) {
            //then signed up for the first time
            //will need to create user on server in this case
            UserService.socialSignup({
              socialType: LOGIN.FACEBOOK,
              token: result.token,
              email: $ionicUser.social.facebook.data.email,
              name: $ionicUser.social.facebook.data.full_name,
              username: $ionicUser.social.facebook.data.username
            }).then(function(res){
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Thanks for signing up!',
               template: 'Now let\'s get cooking!'
              });
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicAuth.logout();
              ErrorService.showErrorAlert();
            });
          } else {
            //then relogging in
            //notify server
            UserService.socialLogin({
              socialType: LOGIN.FACEBOOK,
              token: result.token,
              email: $ionicUser.social.facebook.data.email,
              username: $ionicUser.social.facebook.data.username,
              name: $ionicUser.social.facebook.data.full_name
            }).then(function(res) {
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Login Successful!',
               template: 'Now let\'s get cooking!'
              }); 
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicAuth.logout();
              ErrorService.showErrorAlert();
            });
          }
        }, function(err) {
          scope.$emit('signInStop', false, false);
          clearForm();
          //what types of errors can occur here?
          console.log('error facebook sign in', err);
        });
      };

      scope.signInGoogle = function() {
        //if success, want to let parent know - either $broadcast or $emit
        //also, want to make server call to possibly create User and set current Token for User
        //if failure, then error messages
        scope.$emit('signInStart');
        //loading screen needed? Especially when going to in app browser?
        $ionicAuth.login(LOGIN.GOOGLE).then(function(result) {
          //broadcast/emit to parent to set off appropriate behaviors
          //result will carry whether the login created a new user or not
          if(result.signup) {
            //then signed up for the first time
            //will need to create user on server in this case
            UserService.socialSignup({
              socialType: LOGIN.GOOGLE,
              token: result.token,
              email: $ionicUser.social.google.data.email,
              name: $ionicUser.social.google.data.full_name,
              username: $ionicUser.social.google.data.username
            }).then(function(res) {
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Thanks for signing up!',
               template: 'Now let\'s get cooking!'
              });
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicAuth.logout();
              ErrorService.showErrorAlert();
            });
          } else {
            //then relogging in
            UserService.socialLogin({
              socialType: LOGIN.GOOGLE,
              token: result.token,
              email: $ionicUser.social.google.data.email,
              username: $ionicUser.social.google.data.username,
              name: $ionicUser.social.google.data.full_name
            }).then(function(res) {
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Login Successful!',
               template: 'Now let\'s get cooking!'
              }); 
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicAuth.logout();
              ErrorService.showErrorAlert();
            });
          }
        }, function(err) {
          scope.$emit('signInStop', false);
          //what types of errors can occur here?
          clearForm();
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

      scope.resetCredentials = function() {
        scope.enterEmail = true;
        $ionicModal.fromTemplateUrl('main/templates/password-reset-modal.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $rootScope.redrawSlides = true;
          scope.resetPasswordModal = modal;
          scope.resetPasswordModal.show();
        });
      };

      scope.emailEntered = function() {
        if(!scope.data.resetEmail || !LOGIN.EMAIL_REGEX.test(scope.data.resetEmail)) {
          return false;
        } else {
          return true;
        }
      };

      scope.requestReset = function() {
        scope.enterEmail = false;
        var response = $ionicAuth.requestPasswordReset(scope.data.resetEmail);
      };

      scope.resetIsValid = function() {
        return (scope.data.resetPassword === scope.data.resetConfirmPassword) &&
        (scope.data.resetCode && scope.data.resetCode.length === 6);
      };

      scope.resetPassword = function() {
        $ionicAuth.confirmPasswordReset(scope.data.resetCode, scope.data.resetPassword);
        scope.resetPasswordModal.remove();
        $ionicPopup.alert({
          title: 'Password Reset!',
          template: 'Now let\'s get cooking!'
        });
      };

      scope.cancelReset = function() {
        if(scope.resetPasswordModal) {
          scope.resetPasswordModal.remove();
        }
      };

      scope.$on('$destroy', function() {
        if(scope.resetPasswordModal) {
          scope.resetPasswordModal.remove();
        }
      });
    }
  };
}]);
