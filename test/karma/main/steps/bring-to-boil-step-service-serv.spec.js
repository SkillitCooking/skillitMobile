'use strict';

describe('module: main, service: Steps/bringToBoilStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/bringToBoilStepService;
  beforeEach(inject(function (_Steps/bringToBoilStepService_) {
    Steps/bringToBoilStepService = _Steps/bringToBoilStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/bringToBoilStepService).toBe(true);
  });

});
