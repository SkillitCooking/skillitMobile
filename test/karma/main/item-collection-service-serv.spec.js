'use strict';

describe('module: main, service: ItemCollectionService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ItemCollectionService;
  beforeEach(inject(function (_ItemCollectionService_) {
    ItemCollectionService = _ItemCollectionService_;
  }));

  it('should do something', function () {
    expect(!!ItemCollectionService).toBe(true);
  });

});
