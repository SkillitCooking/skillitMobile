'use strict';

describe('module: main, service: Steps/serveStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/serveStepService;
  beforeEach(inject(function (_Steps/serveStepService_) {
    Steps/serveStepService = _Steps/serveStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/serveStepService).toBe(true);
  });

});
