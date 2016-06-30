'use strict';

describe('module: main, controller: RecipeCollectionPageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var RecipeCollectionPageCtrl;
  beforeEach(inject(function ($controller) {
    RecipeCollectionPageCtrl = $controller('RecipeCollectionPageCtrl');
  }));

  it('should do something', function () {
    expect(!!RecipeCollectionPageCtrl).toBe(true);
  });

});
