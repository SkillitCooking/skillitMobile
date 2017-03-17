'use strict';

describe('module: main, service: Steps/breakEggStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/breakEggStepService;
  beforeEach(inject(function (_Steps/breakEggStepService_) {
    Steps/breakEggStepService = _Steps/breakEggStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/breakEggStepService).toBe(true);
  });

});
