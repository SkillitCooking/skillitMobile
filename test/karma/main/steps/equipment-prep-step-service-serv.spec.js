'use strict';

describe('module: main, service: Steps/equipmentPrepStepService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/equipmentPrepStepService;
  beforeEach(inject(function (_Steps/equipmentPrepStepService_) {
    Steps/equipmentPrepStepService = _Steps/equipmentPrepStepService_;
  }));

  it('should do something', function () {
    expect(!!Steps/equipmentPrepStepService).toBe(true);
  });

});
