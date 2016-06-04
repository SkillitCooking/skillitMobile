'use strict';

describe('module: main, service: SeasoningProfileService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var SeasoningProfileService;
  beforeEach(inject(function (_SeasoningProfileService_) {
    SeasoningProfileService = _SeasoningProfileService_;
  }));

  it('should do something', function () {
    expect(!!SeasoningProfileService).toBe(true);
  });

});
