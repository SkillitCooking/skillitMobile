'use strict';

describe('module: main, service: AnyFormSelectionService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var AnyFormSelectionService;
  beforeEach(inject(function (_AnyFormSelectionService_) {
    AnyFormSelectionService = _AnyFormSelectionService_;
  }));

  it('should do something', function () {
    expect(!!AnyFormSelectionService).toBe(true);
  });

});
