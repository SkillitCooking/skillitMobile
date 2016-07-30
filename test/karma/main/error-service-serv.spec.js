'use strict';

describe('module: main, service: ErrorService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ErrorService;
  beforeEach(inject(function (_ErrorService_) {
    ErrorService = _ErrorService_;
  }));

  it('should do something', function () {
    expect(!!ErrorService).toBe(true);
  });

});
