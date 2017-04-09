'use strict';
angular.module('main')
.directive('loginDirective', ['$window', '$rootScope', '$ionicAuth', '$ionicGoogleAuth', '$ionicFacebookAuth', '$ionicUser', '$ionicModal', '$ionicPopup', '$state', 'UserService', 'ErrorService', 'LOGIN', 'USER', function ($window, $rootScope, $ionicAuth, $ionicGoogleAuth, $ionicFacebookAuth, $ionicUser, $ionicModal, $ionicPopup, $state, UserService, ErrorService, LOGIN, USER) {
  return {
    templateUrl: 'main/templates/login-directive.html',
    restrict: 'E',
    scope: {
      type: '='
    },
    link: function (scope, element, attrs) {
      scope.hasErrors = false;
      scope.data = {};

      switch(scope.type) {
        case 'account':
        case 'popover':
          scope.isSignIn = true;
          scope.isSignUp = true;
          break;
        case 'introSignUp':
          scope.isSignUp = true;
          scope.isSignIn = false;
          scope.isWalkthrough = true;
          break;
        case 'introSignIn':
          scope.isSignUp = false;
          scope.isSignIn = true;
          scope.isWalkthrough = true;
          break;
        default:
          break;
      }

      function clearForm() {
        scope.password = "";
        scope.passwordConfirm = "";
      }

      scope.signUpOrLoginText = function() {
        if(scope.isSignIn && scope.isSignUp) {
          return 'Sign Up or Login for an Account Using:';
        } else if(scope.isSignIn) {
          return 'Login to your Account Using:';
        } else if (scope.isSignUp) {
          return 'Sign Up for an Account Using:';
        }
      };

      scope.signUpOrLoginSubheader = function() {
        if(scope.isSignIn && scope.isSignUp) {
          return 'Sign up to save your favorite dishes, select any dietary restrictions, and receive tailored recipes just for you!';
        } else if(scope.isSignIn) {
          return 'Login to get back to Skillin\' it your way';
        } else if(scope.isSignUp) {
          return 'Sign up to save your favorite dishes, select any dietary restrictions, and receive tailored recipes just for you!';
        }
      };

      scope.getTitle = function() {
        if(scope.isSignUp && scope.isSignIn) {
          return 'Create Your Account!';
        } else if(scope.isSignUp) {
          return 'Create an Account';
        } else if(scope.isSignIn) {
          return 'Login to your Account';
        }
      };

      scope.getLoginClasses = function() {
        if(scope.isWalkthrough) {
          return 'login-screen-walkthrough';
        } else {
          return 'login-screen';
        }
      };

      scope.signIn = function() {
        if(typeof $window.ga !== 'undefined') {
          $window.ga.trackEvent('EmailSignIn', 'signIn');
        }
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
            $ionicUser.set(LOGIN.TYPE, LOGIN.BASIC);
            $ionicUser.save();
            $rootScope.$broadcast('signInStop', true, true);
            clearForm();
            $ionicPopup.alert({
              title: 'Login was successful!',
              template: 'Now let\'s get cooking!'
            }).then(function(res) {
              if(scope.type !== 'popover') {
                $state.go('main.cook');
              } else {
                $rootScope.$broadcast('loginDirective.successfulPopover');
              }
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
        if(typeof $window.ga !== 'undefined') {
          $window.ga.trackEvent('EmailSignUp', 'signUp');
        }
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
              $ionicUser.set(LOGIN.TYPE, LOGIN.BASIC);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Signup Successful!',
               template: 'Now let\'s get cooking!'
              }).then(function(res) {
                if(scope.type !== 'popover') {
                  $state.go('main.cook');
                } else {
                  $rootScope.$broadcast('loginDirective.successfulPopover');
                }
              });
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicUser.unset(LOGIN.TYPE);
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
        if(typeof $window.ga !== 'undefined') {
          $window.ga.trackEvent('FacebookSignIn', 'signIn');
        }
        //if success, want to let parent know - either $broadcast or $emit
        //also, want to make server call to possibly create User and set current Token for User
        //if failure, then error messages
        scope.$emit('signInStart');
        //loading screen needed? Especially when going to in app browser?
        $ionicFacebookAuth.login().then(function(result) {
          //broadcast/emit to parent to set off appropriate behaviors
          //result will carry whether the login created a new user or not
          //different alert cases - new signup vs. existing user
          if(result.signup) {
            //then signed up for the first time
            //will need to create user on server in this case
<<<<<<< HEAD
            var firstName, lastName;
            var rawdata = $ionicUser.social.facebook.data.raw_data;
            if(rawdata.first_name) {
              firstName = rawdata.first_name;
            }
            if(rawdata.last_name) {
              lastName = rawdata.last_name;
            }
            UserService.socialSignup({
              socialType: LOGIN.FACEBOOK,
              token: result.token,
              email: $ionicUser.social.facebook.data.email,
              name: $ionicUser.social.facebook.data.full_name,
              firstName: firstName,
              lastName: lastName
            }).then(function(res){
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.set(LOGIN.TYPE, LOGIN.FACEBOOK);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Thanks for signing up!',
               template: 'Now let\'s get cooking!'
              }).then(function(res) {
                if(scope.type !== 'popover') {
                  $state.go('main.cook');
                } else {
                  $rootScope.$broadcast('loginDirective.successfulPopover');
                }
=======
            console.log($ionicUser.social.facebook.data.raw_data);
            facebookConnectPlugin.getAccessToken(function(token) {
              UserService.socialSignup({
                socialType: LOGIN.FACEBOOK,
                token: result.token,
                email: $ionicUser.social.facebook.data.email,
                name: $ionicUser.social.facebook.data.full_name,
                socialId: $ionicUser.social.facebook.uid,
                fbAccessToken: token
              }).then(function(res){
                $ionicUser.set(USER.ID, res.data._id);
                $ionicUser.set(LOGIN.TYPE, LOGIN.FACEBOOK);
                $ionicUser.save();
                $rootScope.$broadcast('signInStop', true, true);
                clearForm();
                $ionicPopup.alert({
                 title: 'Thanks for signing up!',
                 template: 'Now let\'s get cooking!'
                }).then(function(res) {
                  if(scope.type !== 'popover') {
                    $state.go('main.cook');
                  } else {
                    $rootScope.$broadcast('loginDirective.successfulPopover');
                  }
                });
              }, function(response) {
                $rootScope.$broadcast('signInStop', true, false);
                clearForm();
                $ionicUser.unset(LOGIN.TYPE);
                $ionicFacebookAuth.logout();
                ErrorService.showErrorAlert();
>>>>>>> bff14c9c4592350b228900b736b604a9c4e6018a
              });
            });
          } else {
            //then relogging in
            //notify server
<<<<<<< HEAD
            var firstName, lastName;
            var rawdata = $ionicUser.social.facebook.data.raw_data;
            if(rawdata.first_name) {
              firstName = rawdata.first_name;
            }
            if(rawdata.last_name) {
              lastName = rawdata.last_name;
            }
            UserService.socialLogin({
              socialType: LOGIN.FACEBOOK,
              token: result.token,
              email: $ionicUser.social.facebook.data.email,
              name: $ionicUser.social.facebook.data.full_name,
              firstName: firstName,
              lastName: lastName
            }).then(function(res) {
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.set(LOGIN.TYPE, LOGIN.FACEBOOK);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Login Successful!',
               template: 'Now let\'s get cooking!'
=======
            console.log($ionicUser.social.facebook.data.raw_data);
            facebookConnectPlugin.getAccessToken(function(token) {
              UserService.socialLogin({
                socialType: LOGIN.FACEBOOK,
                token: result.token,
                email: $ionicUser.social.facebook.data.email,
                name: $ionicUser.social.facebook.data.full_name,
                socialId: $ionicUser.social.facebook.uid,
                fbAccessToken: token
>>>>>>> bff14c9c4592350b228900b736b604a9c4e6018a
              }).then(function(res) {
                $ionicUser.set(USER.ID, res.data._id);
                $ionicUser.set(LOGIN.TYPE, LOGIN.FACEBOOK);
                $ionicUser.save();
                $rootScope.$broadcast('signInStop', true, true);
                clearForm();
                $ionicPopup.alert({
                 title: 'Login Successful!',
                 template: 'Now let\'s get cooking!'
                }).then(function(res) {
                  if(scope.type !== 'popover') {
                    $state.go('main.cook');
                  } else {
                    $rootScope.$broadcast('loginDirective.successfulPopover');
                  }
                });
              }, function(response) {
                $rootScope.$broadcast('signInStop', true, false);
                clearForm();
                $ionicUser.unset(LOGIN.TYPE);
                $ionicFacebookAuth.logout();
                ErrorService.showErrorAlert();
              });
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
        if(typeof $window.ga !== 'undefined') {
          $window.ga.trackEvent('GoogleLogIn', 'LogIn');
        }
        //if success, want to let parent know - either $broadcast or $emit
        //also, want to make server call to possibly create User and set current Token for User
        //if failure, then error messages
        scope.$emit('signInStart');
        //loading screen needed? Especially when going to in app browser?
        $ionicGoogleAuth.login().then(function(result) {
          //broadcast/emit to parent to set off appropriate behaviors
          //result will carry whether the login created a new user or not
          if(result.signup) {
            //then signed up for the first time
            //will need to create user on server in this case
            var firstName, lastName;
            var rawdata = $ionicUser.social.google.data.raw_data;
            if(rawdata.name) {
              firstName = rawdata.name.givenName;
              lastName = rawdata.name.familyName;
            }
            console.log($ionicUser.social.google.data.raw_data);
            UserService.socialSignup({
              socialType: LOGIN.GOOGLE,
              token: result.token,
              email: $ionicUser.social.google.data.email,
              name: $ionicUser.social.google.data.full_name,
              firstName: firstName,
              lastName: lastName,
              socialId: $ionicUser.social.google.uid
            }).then(function(res) {
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.set(LOGIN.TYPE, LOGIN.GOOGLE);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Thanks for signing up!',
               template: 'Now let\'s get cooking!'
              }).then(function(res) {
                if(scope.type !== 'popover') {
                  $state.go('main.cook');
                } else {
                  $rootScope.$broadcast('loginDirective.successfulPopover');
                }
              });
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicUser.unset(LOGIN.TYPE);
              $ionicGoogleAuth.logout();
              ErrorService.showErrorAlert();
            });
          } else {
            //then relogging in
            var firstName, lastName;
            var rawdata = $ionicUser.social.google.data.raw_data;
            if(rawdata.name) {
              firstName = rawdata.name.givenName;
              lastName = rawdata.name.familyName;
            }
            console.log($ionicUser.social.google.data.raw_data);
            UserService.socialLogin({
              socialType: LOGIN.GOOGLE,
              token: result.token,
              email: $ionicUser.social.google.data.email,
              name: $ionicUser.social.google.data.full_name,
              firstName: firstName,
              lastName: lastName,
              socialId: $ionicUser.social.google.uid
            }).then(function(res) {
              $ionicUser.set(USER.ID, res.data._id);
              $ionicUser.set(LOGIN.TYPE, LOGIN.GOOGLE);
              $ionicUser.save();
              $rootScope.$broadcast('signInStop', true, true);
              clearForm();
              $ionicPopup.alert({
               title: 'Login Successful!',
               template: 'Now let\'s get cooking!'
              }).then(function(res) {
                if(scope.type !== 'popover') {
                  $state.go('main.cook');
                } else {
                  $rootScope.$broadcast('loginDirective.successfulPopover');
                }
              }); 
            }, function(response) {
              $rootScope.$broadcast('signInStop', true, false);
              clearForm();
              $ionicUser.unset(LOGIN.TYPE);
              $ionicGoogleAuth.logout();
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
          scope.signInPasswordJustRight = false;
          if(scope.password && scope.password.length < LOGIN.MIN_PASSWORD_LENGTH) {
            scope.signInPasswordTooShort = true;
          } else {
            scope.signInPasswordTooShort = false;
          }
          return true;
        } else {
          scope.signInPasswordTooShort = false;
          scope.signInPasswordJustRight = true;
        }
        return false;
      };

      scope.isSignUpDisabled = function() {
        if(!scope.email || !LOGIN.EMAIL_REGEX.test(scope.email)) {
          return true;
        }
        if(!scope.password || scope.password.length < LOGIN.MIN_PASSWORD_LENGTH) {
          scope.signInPasswordJustRight = false;
          if(scope.password && scope.password.length < LOGIN.MIN_PASSWORD_LENGTH) {
            scope.signInPasswordTooShort = true;
          } else {
            scope.signInPasswordTooShort = false;
          }
          return true;
        } else {
          scope.signInPasswordTooShort = false;
          scope.signInPasswordJustRight = true;
        }
        if(!scope.passwordConfirm || scope.passwordConfirm !== scope.password) {
          if(scope.passwordConfirm) {
            scope.passwordConfirmGood = false;
            scope.passwordConfirmBad = true;
          } else {
            scope.passwordConfirmGood = false;
            scope.passwordConfirmBad = false;
          }
          return true;
        } else {
          scope.passwordConfirmGood = true;
          scope.passwordConfirmBad = false;
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
