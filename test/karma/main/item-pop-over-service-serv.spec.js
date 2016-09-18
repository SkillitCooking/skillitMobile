'use strict';

describe('module: main, service: ItemPopOverService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ItemPopOverService;
  beforeEach(inject(function (_ItemPopOverService_) {
    ItemPopOverService = _ItemPopOverService_;
  }));

  it('should do something', function () {
    expect(!!ItemPopOverService).toBe(true);
  });

});
