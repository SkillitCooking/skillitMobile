'use strict';

describe('module: main, service: ContentTextService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ContentTextService;
  beforeEach(inject(function (_ContentTextService_) {
    ContentTextService = _ContentTextService_;
  }));

  it('should do something', function () {
    expect(!!ContentTextService).toBe(true);
  });

});
