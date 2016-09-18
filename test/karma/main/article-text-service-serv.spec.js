'use strict';

describe('module: main, service: ArticleTextService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ArticleTextService;
  beforeEach(inject(function (_ArticleTextService_) {
    ArticleTextService = _ArticleTextService_;
  }));

  it('should do something', function () {
    expect(!!ArticleTextService).toBe(true);
  });

});
