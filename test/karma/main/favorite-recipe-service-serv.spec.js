'use strict';

describe('module: main, service: FavoriteRecipeService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var FavoriteRecipeService;
  beforeEach(inject(function (_FavoriteRecipeService_) {
    FavoriteRecipeService = _FavoriteRecipeService_;
  }));

  it('should do something', function () {
    expect(!!FavoriteRecipeService).toBe(true);
  });

});
