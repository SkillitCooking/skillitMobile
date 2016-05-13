'use strict';

describe('module: main, service: Steps/seasonStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/seasonStepService;
  beforeEach(inject(function (_Steps/seasonStepService_) {
    Steps/seasonStepService = _Steps/seasonStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/seasonStepService).toBe(true);
  });

});
