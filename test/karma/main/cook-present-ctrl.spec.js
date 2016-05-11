'use strict';

describe('module: main, controller: CookPresentCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var CookPresentCtrl;
  beforeEach(inject(function ($controller) {
    CookPresentCtrl = $controller('CookPresentCtrl');
  }));

  it('should do something', function () {
    expect(!!CookPresentCtrl).toBe(true);
  });

});
