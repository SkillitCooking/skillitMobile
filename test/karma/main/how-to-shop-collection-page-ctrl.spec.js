'use strict';

describe('module: main, controller: HowToShopCollectionPageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var HowToShopCollectionPageCtrl;
  beforeEach(inject(function ($controller) {
    HowToShopCollectionPageCtrl = $controller('HowToShopCollectionPageCtrl');
  }));

  it('should do something', function () {
    expect(!!HowToShopCollectionPageCtrl).toBe(true);
  });

});
