'use strict';

describe('module: main, service: CutStepCombinationService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var CutStepCombinationService;
  beforeEach(inject(function (_CutStepCombinationService_) {
    CutStepCombinationService = _CutStepCombinationService_;
  }));

  it('should do something', function () {
    expect(!!CutStepCombinationService).toBe(true);
  });

});
