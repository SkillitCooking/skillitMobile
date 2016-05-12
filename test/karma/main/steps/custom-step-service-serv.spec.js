'use strict';

describe('module: main, service: Steps/customStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/customStepService;
  beforeEach(inject(function (_Steps/customStepService_) {
    Steps/customStepService = _Steps/customStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/customStepService).toBe(true);
  });

});
