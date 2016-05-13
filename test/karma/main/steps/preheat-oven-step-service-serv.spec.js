'use strict';

describe('module: main, service: Steps/preheatOvenStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/preheatOvenStepService;
  beforeEach(inject(function (_Steps/preheatOvenStepService_) {
    Steps/preheatOvenStepService = _Steps/preheatOvenStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/preheatOvenStepService).toBe(true);
  });

});
