'use strict';

describe('module: main, service: RecipeBadgeService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var RecipeBadgeService;
  beforeEach(inject(function (_RecipeBadgeService_) {
    RecipeBadgeService = _RecipeBadgeService_;
  }));

  it('should do something', function () {
    expect(!!RecipeBadgeService).toBe(true);
  });

});
