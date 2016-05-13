'use strict';

describe('module: main, service: Steps/dryStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/dryStepService;
  beforeEach(inject(function (_Steps/dryStepService_) {
    Steps/dryStepService = _Steps/dryStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/dryStepService).toBe(true);
  });

});
