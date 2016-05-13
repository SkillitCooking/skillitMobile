'use strict';

describe('module: main, service: Steps/cutStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/cutStepService;
  beforeEach(inject(function (_Steps/cutStepService_) {
    Steps/cutStepService = _Steps/cutStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/cutStepService).toBe(true);
  });

});
