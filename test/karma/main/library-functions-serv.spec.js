'use strict';

describe('module: main, service: LibraryFunctions', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var LibraryFunctions;
  beforeEach(inject(function (_LibraryFunctions_) {
    LibraryFunctions = _LibraryFunctions_;
  }));

  it('should do something', function () {
    expect(!!LibraryFunctions).toBe(true);
  });

});
