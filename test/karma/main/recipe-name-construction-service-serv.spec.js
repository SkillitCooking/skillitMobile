'use strict';

describe('module: main, service: RecipeNameConstructionService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var RecipeNameConstructionService;
  beforeEach(inject(function (_RecipeNameConstructionService_) {
    RecipeNameConstructionService = _RecipeNameConstructionService_;
  }));

  it('should do something', function () {
    expect(!!RecipeNameConstructionService).toBe(true);
  });

});
