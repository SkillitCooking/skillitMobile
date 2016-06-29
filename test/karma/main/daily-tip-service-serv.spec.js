'use strict';

describe('module: main, service: DailyTipService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var DailyTipService;
  beforeEach(inject(function (_DailyTipService_) {
    DailyTipService = _DailyTipService_;
  }));

  it('should do something', function () {
    expect(!!DailyTipService).toBe(true);
  });

});
