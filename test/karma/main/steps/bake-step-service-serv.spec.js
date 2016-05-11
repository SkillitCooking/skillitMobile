'use strict';

describe('module: main, service: Steps/bakeStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/bakeStepService;
  beforeEach(inject(function (_Steps/bakeStepService_) {
    Steps/bakeStepService = _Steps/bakeStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/bakeStepService).toBe(true);
  });

});
