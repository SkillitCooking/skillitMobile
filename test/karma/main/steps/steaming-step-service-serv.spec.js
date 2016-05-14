'use strict';

describe('module: main, service: Steps/steamingStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/steamingStepService;
  beforeEach(inject(function (_Steps/steamingStepService_) {
    Steps/steamingStepService = _Steps/steamingStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/steamingStepService).toBe(true);
  });

});
