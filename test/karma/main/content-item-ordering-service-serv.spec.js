'use strict';

describe('module: main, service: ContentItemOrderingService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ContentItemOrderingService;
  beforeEach(inject(function (_ContentItemOrderingService_) {
    ContentItemOrderingService = _ContentItemOrderingService_;
  }));

  it('should do something', function () {
    expect(!!ContentItemOrderingService).toBe(true);
  });

});
