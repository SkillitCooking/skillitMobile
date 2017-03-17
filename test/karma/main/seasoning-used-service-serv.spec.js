'use strict';

describe('module: main, service: SeasoningUsedService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var SeasoningUsedService;
  beforeEach(inject(function (_SeasoningUsedService_) {
    SeasoningUsedService = _SeasoningUsedService_;
  }));

  it('should do something', function () {
    expect(!!SeasoningUsedService).toBe(true);
  });

});
