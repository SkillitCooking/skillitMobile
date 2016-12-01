'use strict';

describe('module: main, service: IngredientsUsedService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var IngredientsUsedService;
  beforeEach(inject(function (_IngredientsUsedService_) {
    IngredientsUsedService = _IngredientsUsedService_;
  }));

  it('should do something', function () {
    expect(!!IngredientsUsedService).toBe(true);
  });

});
