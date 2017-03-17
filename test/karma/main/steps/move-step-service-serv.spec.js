'use strict';

describe('module: main, service: Steps/moveStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/moveStepService;
  beforeEach(inject(function (_Steps/moveStepService_) {
    Steps/moveStepService = _Steps/moveStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/moveStepService).toBe(true);
  });

});
