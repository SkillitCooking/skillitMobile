'use strict';

describe('module: main, service: StepTipService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var StepTipService;
  beforeEach(inject(function (_StepTipService_) {
    StepTipService = _StepTipService_;
  }));

  it('should do something', function () {
    expect(!!StepTipService).toBe(true);
  });

});
