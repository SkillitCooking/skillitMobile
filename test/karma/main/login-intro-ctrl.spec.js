'use strict';

describe('module: main, controller: LoginIntroCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var LoginIntroCtrl;
  beforeEach(inject(function ($controller) {
    LoginIntroCtrl = $controller('LoginIntroCtrl');
  }));

  it('should do something', function () {
    expect(!!LoginIntroCtrl).toBe(true);
  });

});
