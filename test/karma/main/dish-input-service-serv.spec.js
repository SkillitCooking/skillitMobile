'use strict';

describe('module: main, service: DishInputService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var DishInputService;
  beforeEach(inject(function (_DishInputService_) {
    DishInputService = _DishInputService_;
  }));

  it('should do something', function () {
    expect(!!DishInputService).toBe(true);
  });

});
