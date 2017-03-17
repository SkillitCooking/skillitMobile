'use strict';

describe('module: main, service: MealsCookedService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var MealsCookedService;
  beforeEach(inject(function (_MealsCookedService_) {
    MealsCookedService = _MealsCookedService_;
  }));

  it('should do something', function () {
    expect(!!MealsCookedService).toBe(true);
  });

});
