'use strict';

describe('module: main, service: LoginService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var LoginService;
  beforeEach(inject(function (_LoginService_) {
    LoginService = _LoginService_;
  }));

  it('should do something', function () {
    expect(!!LoginService).toBe(true);
  });

});
