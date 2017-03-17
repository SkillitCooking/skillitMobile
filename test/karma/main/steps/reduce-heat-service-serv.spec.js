'use strict';

describe('module: main, service: Steps/reduceHeatService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Steps/reduceHeatService;
  beforeEach(inject(function (_Steps/reduceHeatService_) {
    Steps/reduceHeatService = _Steps/reduceHeatService_;
  }));

  it('should do something', function () {
    expect(!!Steps/reduceHeatService).toBe(true);
  });

});
