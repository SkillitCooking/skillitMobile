'use strict';

describe('module: main, service: Steps/boilStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/boilStepService;
  beforeEach(inject(function (_Steps/boilStepService_) {
    Steps/boilStepService = _Steps/boilStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/boilStepService).toBe(true);
  });

});
