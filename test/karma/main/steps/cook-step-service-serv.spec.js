'use strict';

describe('module: main, service: Steps/cookStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/cookStepService;
  beforeEach(inject(function (_Steps/cookStepService_) {
    Steps/cookStepService = _Steps/cookStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/cookStepService).toBe(true);
  });

});
