'use strict';

describe('module: main, controller: ChaptersCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ChaptersCtrl;
  beforeEach(inject(function ($controller) {
    ChaptersCtrl = $controller('ChaptersCtrl');
  }));

  it('should do something', function () {
    expect(!!ChaptersCtrl).toBe(true);
  });

});
