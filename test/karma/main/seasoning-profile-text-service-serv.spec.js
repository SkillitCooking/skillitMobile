'use strict';

describe('module: main, service: SeasoningProfileTextService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var SeasoningProfileTextService;
  beforeEach(inject(function (_SeasoningProfileTextService_) {
    SeasoningProfileTextService = _SeasoningProfileTextService_;
  }));

  it('should do something', function () {
    expect(!!SeasoningProfileTextService).toBe(true);
  });

});
