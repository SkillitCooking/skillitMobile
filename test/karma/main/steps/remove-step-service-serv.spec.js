'use strict';

describe('module: main, service: Steps/removeStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/removeStepService;
  beforeEach(inject(function (_Steps/removeStepService_) {
    Steps/removeStepService = _Steps/removeStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/removeStepService).toBe(true);
  });

});
