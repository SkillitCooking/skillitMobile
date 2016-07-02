'use strict';

describe('module: main, service: HowToShopService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var HowToShopService;
  beforeEach(inject(function (_HowToShopService_) {
    HowToShopService = _HowToShopService_;
  }));

  it('should do something', function () {
    expect(!!HowToShopService).toBe(true);
  });

});
