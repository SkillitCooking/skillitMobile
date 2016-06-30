'use strict';

describe('module: main, controller: TipCollectionPageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var TipCollectionPageCtrl;
  beforeEach(inject(function ($controller) {
    TipCollectionPageCtrl = $controller('TipCollectionPageCtrl');
  }));

  it('should do something', function () {
    expect(!!TipCollectionPageCtrl).toBe(true);
  });

});
