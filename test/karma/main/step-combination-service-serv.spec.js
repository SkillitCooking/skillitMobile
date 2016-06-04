'use strict';

describe('module: main, service: StepCombinationService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var StepCombinationService;
  beforeEach(inject(function (_StepCombinationService_) {
    StepCombinationService = _StepCombinationService_;
  }));

  it('should do something', function () {
    expect(!!StepCombinationService).toBe(true);
  });

});
