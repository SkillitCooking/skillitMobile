'use strict';

describe('module: main, service: DietaryPreferencesService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var DietaryPreferencesService;
  beforeEach(inject(function (_DietaryPreferencesService_) {
    DietaryPreferencesService = _DietaryPreferencesService_;
  }));

  it('should do something', function () {
    expect(!!DietaryPreferencesService).toBe(true);
  });

});
