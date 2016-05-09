'use strict';

describe('module: main, controller: RecipesCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var RecipesCtrl;
  beforeEach(inject(function ($controller) {
    RecipesCtrl = $controller('RecipesCtrl');
  }));

  it('should do something', function () {
    expect(!!RecipesCtrl).toBe(true);
  });

});
