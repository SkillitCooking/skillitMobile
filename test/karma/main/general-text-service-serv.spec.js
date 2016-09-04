'use strict';

describe('module: main, service: GeneralTextService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var GeneralTextService;
  beforeEach(inject(function (_GeneralTextService_) {
    GeneralTextService = _GeneralTextService_;
  }));

  it('should do something', function () {
    expect(!!GeneralTextService).toBe(true);
  });

});
