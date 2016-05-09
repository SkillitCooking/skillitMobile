'use strict';

describe('module: main, controller: CookCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var CookCtrl;
  beforeEach(inject(function ($controller) {
    CookCtrl = $controller('CookCtrl');
  }));

  it('should do something', function () {
    expect(!!CookCtrl).toBe(true);
  });

});
