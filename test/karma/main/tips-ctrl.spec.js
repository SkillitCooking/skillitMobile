'use strict';

describe('module: main, controller: TipsCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var TipsCtrl;
  beforeEach(inject(function ($controller) {
    TipsCtrl = $controller('TipsCtrl');
  }));

  it('should do something', function () {
    expect(!!TipsCtrl).toBe(true);
  });

});
