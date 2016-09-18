'use strict';

describe('module: main, service: ChapterService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ChapterService;
  beforeEach(inject(function (_ChapterService_) {
    ChapterService = _ChapterService_;
  }));

  it('should do something', function () {
    expect(!!ChapterService).toBe(true);
  });

});
