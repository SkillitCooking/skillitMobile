'use strict';

describe('module: main, service: LessonService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var LessonService;
  beforeEach(inject(function (_LessonService_) {
    LessonService = _LessonService_;
  }));

  it('should do something', function () {
    expect(!!LessonService).toBe(true);
  });

});
