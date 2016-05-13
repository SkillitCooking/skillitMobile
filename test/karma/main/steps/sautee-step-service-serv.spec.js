'use strict';

describe('module: main, service: Steps/sauteeStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/sauteeStepService;
  beforeEach(inject(function (_Steps/sauteeStepService_) {
    Steps/sauteeStepService = _Steps/sauteeStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/sauteeStepService).toBe(true);
  });

});
