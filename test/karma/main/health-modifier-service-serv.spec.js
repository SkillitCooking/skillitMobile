'use strict';

describe('module: main, service: HealthModifierService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var HealthModifierService;
  beforeEach(inject(function (_HealthModifierService_) {
    HealthModifierService = _HealthModifierService_;
  }));

  it('should do something', function () {
    expect(!!HealthModifierService).toBe(true);
  });

});
