'use strict';

describe('module: main, service: Steps/placeStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/placeStepService;
  beforeEach(inject(function (_Steps/placeStepService_) {
    Steps/placeStepService = _Steps/placeStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/placeStepService).toBe(true);
  });

});
