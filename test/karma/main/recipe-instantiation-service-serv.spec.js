'use strict';

describe('module: main, service: RecipeInstantiationService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var RecipeInstantiationService;
  beforeEach(inject(function (_RecipeInstantiationService_) {
    RecipeInstantiationService = _RecipeInstantiationService_;
  }));

  it('should do something', function () {
    expect(!!RecipeInstantiationService).toBe(true);
  });

});
