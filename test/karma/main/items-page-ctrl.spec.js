'use strict';

describe('module: main, controller: ItemsPageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ItemsPageCtrl;
  beforeEach(inject(function ($controller) {
    ItemsPageCtrl = $controller('ItemsPageCtrl');
  }));

  it('should do something', function () {
    expect(!!ItemsPageCtrl).toBe(true);
  });

});
