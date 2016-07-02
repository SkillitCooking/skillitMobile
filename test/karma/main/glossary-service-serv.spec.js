'use strict';

describe('module: main, service: GlossaryService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var GlossaryService;
  beforeEach(inject(function (_GlossaryService_) {
    GlossaryService = _GlossaryService_;
  }));

  it('should do something', function () {
    expect(!!GlossaryService).toBe(true);
  });

});
