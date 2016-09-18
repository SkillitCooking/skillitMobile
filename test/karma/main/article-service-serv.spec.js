'use strict';

describe('module: main, service: ArticleService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ArticleService;
  beforeEach(inject(function (_ArticleService_) {
    ArticleService = _ArticleService_;
  }));

  it('should do something', function () {
    expect(!!ArticleService).toBe(true);
  });

});
