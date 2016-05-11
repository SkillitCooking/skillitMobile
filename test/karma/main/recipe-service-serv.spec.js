'use strict';

describe('module: main, service: RecipeService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var RecipeService;
  beforeEach(inject(function (_RecipeService_) {
    RecipeService = _RecipeService_;
  }));

  it('should do something', function () {
    expect(!!RecipeService).toBe(true);
  });

});
