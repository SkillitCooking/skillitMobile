'use strict';

describe('module: main, service: Steps/stirStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/stirStepService;
  beforeEach(inject(function (_Steps/stirStepService_) {
    Steps/stirStepService = _Steps/stirStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/stirStepService).toBe(true);
  });

});
