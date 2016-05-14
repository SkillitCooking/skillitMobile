'use strict';

describe('module: main, service: Steps/slowCookStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/slowCookStepService;
  beforeEach(inject(function (_Steps/slowCookStepService_) {
    Steps/slowCookStepService = _Steps/slowCookStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/slowCookStepService).toBe(true);
  });

});
