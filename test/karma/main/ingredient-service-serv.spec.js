'use strict';

describe('module: main, service: IngredientService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var IngredientService;
  beforeEach(inject(function (_IngredientService_) {
    IngredientService = _IngredientService_;
  }));

  it('should do something', function () {
    expect(!!IngredientService).toBe(true);
  });

});
