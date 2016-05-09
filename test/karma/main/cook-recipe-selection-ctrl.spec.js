'use strict';

describe('module: main, controller: CookRecipeSelectionCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var CookRecipeSelectionCtrl;
  beforeEach(inject(function ($controller) {
    CookRecipeSelectionCtrl = $controller('CookRecipeSelectionCtrl');
  }));

  it('should do something', function () {
    expect(!!CookRecipeSelectionCtrl).toBe(true);
  });

});
