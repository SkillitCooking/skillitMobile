'use strict';

describe('module: main, service: ErrorLoggingService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ErrorLoggingService;
  beforeEach(inject(function (_ErrorLoggingService_) {
    ErrorLoggingService = _ErrorLoggingService_;
  }));

  it('should do something', function () {
    expect(!!ErrorLoggingService).toBe(true);
  });

});
