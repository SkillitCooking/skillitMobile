'use strict';

describe('module: main, service: Steps/heatStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/heatStepService;
  beforeEach(inject(function (_Steps/heatStepService_) {
    Steps/heatStepService = _Steps/heatStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/heatStepService).toBe(true);
  });

});
