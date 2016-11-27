'use strict';

describe('module: main, controller: TestCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var TestCtrl;
  beforeEach(inject(function ($controller) {
    TestCtrl = $controller('TestCtrl');
  }));

  it('should do something', function () {
    expect(!!TestCtrl).toBe(true);
  });

});
