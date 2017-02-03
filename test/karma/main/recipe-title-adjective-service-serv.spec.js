'use strict';

describe('module: main, service: RecipeTitleAdjectiveService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var RecipeTitleAdjectiveService;
  beforeEach(inject(function (_RecipeTitleAdjectiveService_) {
    RecipeTitleAdjectiveService = _RecipeTitleAdjectiveService_;
  }));

  it('should do something', function () {
    expect(!!RecipeTitleAdjectiveService).toBe(true);
  });

});
