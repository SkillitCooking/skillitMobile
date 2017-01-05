'use strict';

describe('module: main, service: ProgressiveStepTipService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ProgressiveStepTipService;
  beforeEach(inject(function (_ProgressiveStepTipService_) {
    ProgressiveStepTipService = _ProgressiveStepTipService_;
  }));

  it('should do something', function () {
    expect(!!ProgressiveStepTipService).toBe(true);
  });

});
