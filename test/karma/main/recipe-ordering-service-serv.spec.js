'use strict';

describe('module: main, service: RecipeOrderingService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var RecipeOrderingService;
  beforeEach(inject(function (_RecipeOrderingService_) {
    RecipeOrderingService = _RecipeOrderingService_;
  }));

  it('should do something', function () {
    expect(!!RecipeOrderingService).toBe(true);
  });

});
